# lstm_diff_model_higher_order.py
# LSTM + Conv1D + Attention 模型：使用多階差分作為特徵，捕捉更高頻波動

import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Model
from tensorflow.keras.layers import (
    Input, Conv1D, BatchNormalization,
    LSTM, Dropout, Attention, Flatten, Dense
)
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.losses import Huber
from sklearn.metrics import mean_absolute_error, mean_squared_error
import matplotlib.pyplot as plt


def load_and_feature_engineer(path):
    """
    載入 CSV，執行多階差分和其他特徵工程：
    - lag_1, lag_2, lag_3: 過去 usage
    - delta_prev1, delta_prev2, delta_prev3: 一階、二階、三階差分（前向）
    - 時間週期 & 日曆特徵
    - 目標 delta_target: 下一小時的 usage 變化量
    """
    df = pd.read_csv(path, parse_dates=['timestamp'])
    df.set_index('timestamp', inplace=True)

    # 歷史使用量滯後
    df['lag_1'] = df['usage'].shift(1)
    df['lag_2'] = df['usage'].shift(2)
    df['lag_3'] = df['usage'].shift(3)

    # 多階差分特徵
    # delta_prev1 = usage[t] - usage[t-1]
    df['delta_prev1'] = df['usage'].diff().shift(1)
    # delta_prev2 = delta_prev1[t] - delta_prev1[t-1]
    df['delta_prev2'] = df['delta_prev1'].diff().shift(1)
    # delta_prev3 = delta_prev2[t] - delta_prev2[t-1]
    df['delta_prev3'] = df['delta_prev2'].diff().shift(1)

    # 時間週期特徵
    df['hour']     = df.index.hour
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
    # 日曆特徵
    df['is_weekend'] = (df.index.weekday >= 5).astype(int)

    # 目標：下一小時差分
    df['delta_target'] = df['usage'].shift(-1) - df['usage']

    # 移除 NaN
    df.dropna(inplace=True)
    return df


def create_sequences(X, y, look_back):
    """
    生成序列：每筆 Xs.shape=(look_back, n_features)，ys.shape=(, )
    """
    Xs, ys = [], []
    for i in range(len(X) - look_back):
        Xs.append(X[i : i + look_back])
        ys.append(y[i + look_back])
    return np.array(Xs), np.array(ys)


def build_model(look_back, n_features, n_units, dropout_rate):
    """
    构建 Conv1D + LSTM + Attention 模型，并用 Flatten 保留所有时序特征
    """
    inp = Input(shape=(look_back, n_features))
    x = Conv1D(32, kernel_size=3, padding='causal', activation='relu')(inp)
    x = BatchNormalization()(x)
    x = LSTM(n_units, return_sequences=True)(x)
    x = Dropout(dropout_rate)(x)
    attn = Attention()([x, x])
    x = Flatten()(attn)
    x = Dropout(dropout_rate)(x)
    out = Dense(1, activation='linear')(x)

    model = Model(inputs=inp, outputs=out)
    model.compile(optimizer='adam', loss=Huber(), metrics=['mae'])
    return model


def plot_results(true_usage, pred_usage, num_points=50):
    plt.figure(figsize=(10,4))
    plt.plot(true_usage[:num_points], 'o-', label='Actual Usage')
    plt.plot(pred_usage[:num_points], 'x--', label='Predicted Usage')
    plt.title('Usage Forecast (Higher-Order Diff Model)')
    plt.xlabel('Sample index')
    plt.ylabel('Usage')
    plt.legend(); plt.tight_layout(); plt.show()


def main():
    # 參數
    csv_path = 'water_usage_hourly.csv'
    look_back    = 48
    n_units      = 64
    batch_size   = 32
    epochs       = 50
    patience     = 10
    dropout_rate = 0.1

    # --- 載入與特徵 ---
    df = load_and_feature_engineer(csv_path)
    features = [
        'lag_1','lag_2','lag_3',
        'delta_prev1','delta_prev2','delta_prev3',
        'hour_sin','hour_cos','is_weekend',
        'rainfall','temperature','water_level'
    ]
    target = df['delta_target'].values.reshape(-1,1)

    # --- 縮放 ---
    scaler_X = MinMaxScaler()
    scaler_y = MinMaxScaler()
    X_all = scaler_X.fit_transform(df[features])
    y_all = scaler_y.fit_transform(target).flatten()

    # --- 序列生成 & 拆分 ---
    Xs, ys = create_sequences(X_all, y_all, look_back)
    n = len(Xs)
    i1, i2 = int(n*0.7), int(n*0.85)
    X_train, y_train = Xs[:i1], ys[:i1]
    X_val,   y_val   = Xs[i1:i2], ys[i1:i2]
    X_test,  y_test  = Xs[i2:], ys[i2:]

    # --- 建模 & 訓練 ---
    model = build_model(look_back, Xs.shape[2], n_units, dropout_rate)
    es = EarlyStopping(monitor='val_loss', patience=patience, restore_best_weights=True)
    rl = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-5)
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=epochs,
        batch_size=batch_size,
        callbacks=[es, rl],
        verbose=2
    )

    # --- 預測 & 重構 ---
    delta_pred_s = model.predict(X_test)
    delta_pred = scaler_y.inverse_transform(delta_pred_s).flatten()
    # 原始 usage 對齊
    usage_series = df['usage'].values
    # baseline 為 X_test 第一個對應的 usage
    base_idx = look_back + (n - len(delta_pred))
    base_usage = usage_series[base_idx - 1: base_idx - 1 + len(delta_pred)]
    pred_usage = base_usage + delta_pred
    true_usage = usage_series[base_idx: base_idx + len(delta_pred)]

    # --- 評估 ---
    print("MAE:", mean_absolute_error(true_usage, pred_usage))
    print("MSE:", mean_squared_error(true_usage, pred_usage))

    # --- 視覺化 ---
    plot_results(true_usage, pred_usage, num_points=50)

    # --- 儲存 ---
    model.save('lstm_diff_model_higher_order.keras', save_format='keras')
    with open('scaler_X_dh.pkl','wb') as f: pickle.dump(scaler_X,f)
    with open('scaler_y_dh.pkl','wb') as f: pickle.dump(scaler_y,f)
    print("High-order diff model saved.")

if __name__ == '__main__':
    main()
