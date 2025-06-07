from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
from tensorflow.keras.models import load_model
import threading
import os
import mysql.connector
from datetime import datetime

app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/api/*": {"origins": "*"}})
lock = threading.Lock()

# --- 全域變數 ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, 'water_usage_hourly.csv')
model_path = os.path.join(BASE_DIR, 'lstm_diff_model_higher_order.keras')
scaler_X_path = os.path.join(BASE_DIR, 'scaler_X_dh.pkl')
scaler_y_path = os.path.join(BASE_DIR, 'scaler_y_dh.pkl')
look_back = 48

# 資料庫設定
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '1234',
    'database': 'water_monitor'
}

def insert_prediction(timestamp, actual, predicted, diff, anomaly):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        sql = """
            INSERT INTO predictions (timestamp, actual_usage, predicted_usage, diff, is_anomaly)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (timestamp, actual, predicted, diff, anomaly))
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        print(f"Database Error: {err}")

# 載入模型與 Scaler
print("🟡 讀取模型中...")
tf_model = load_model(model_path)
print("✅ 模型讀取完成")

print("🟡 載入 Scaler...")
with open(scaler_X_path, 'rb') as f:
    scaler_X = pickle.load(f)
with open(scaler_y_path, 'rb') as f:
    scaler_y = pickle.load(f)
print("✅ Scaler 載入完成")

# 載入 CSV
print("🟡 讀入 CSV...")
df = pd.read_csv(csv_path)
df['timestamp'] = pd.to_datetime(df['timestamp'])
df.set_index('timestamp', inplace=True)
for lag in [1, 2, 3]:
    df[f'lag_{lag}'] = df['usage'].shift(lag)
df['delta_prev1'] = df['usage'].diff().shift(1)
df['delta_prev2'] = df['delta_prev1'].diff().shift(1)
df['delta_prev3'] = df['delta_prev2'].diff().shift(1)
df['hour'] = df.index.hour
df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
df['is_weekend'] = (df.index.weekday >= 5).astype(int)
df.dropna(inplace=True)
print("✅ CSV 讀取完成")

# 預測資料
features = [
    'lag_1', 'lag_2', 'lag_3',
    'delta_prev1', 'delta_prev2', 'delta_prev3',
    'hour_sin', 'hour_cos', 'is_weekend',
    'rainfall', 'temperature', 'water_level'
]
X_all = scaler_X.transform(df[features])
usage_all = df['usage'].values.astype(float)
t_ptr = look_back - 1

# --- Routes ---

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/monitor.html')
def monitor():
    return send_from_directory(app.static_folder, 'monitor.html')

@app.route('/api/next')
def api_next():
    global t_ptr
    with lock:
        if t_ptr >= len(usage_all) - 1:
            return jsonify({'actual': None, 'predicted': None})

        window = X_all[t_ptr - look_back + 1: t_ptr + 1]
        seq = window.reshape(1, look_back, len(features))
        d_s = tf_model.predict(seq, verbose=0)[0, 0]
        d = float(scaler_y.inverse_transform([[d_s]])[0, 0])
        base = float(usage_all[t_ptr])
        pred_u = base + d
        actual_u = float(usage_all[t_ptr + 1])
        t_ptr += 1

    return jsonify({'actual': actual_u, 'predicted': pred_u})

@app.route('/api/status')
def api_status():
    global t_ptr
    with lock:
        if t_ptr <= look_back or t_ptr >= len(usage_all):
            return jsonify({'status': 'no_data'})

        last_actual = float(usage_all[t_ptr])
        window = X_all[t_ptr - look_back + 1: t_ptr + 1]
        seq = window.reshape(1, look_back, len(features))
        d_s = tf_model.predict(seq, verbose=0)[0, 0]
        d = float(scaler_y.inverse_transform([[d_s]])[0, 0])
        pred_u = float(usage_all[t_ptr - 1]) + d

        threshold = pred_u * 1.1
        diff = last_actual - pred_u
        is_anomaly = last_actual > threshold

        now = df.index[t_ptr]
        insert_prediction(now, last_actual, pred_u, diff, is_anomaly)

    return jsonify({
        'actual': last_actual,
        'predicted': pred_u,
        'diff': diff,
        'threshold': round(threshold, 2),
        'threshold_desc': "實際值超過預測值 10% 即為異常",
        'anomaly': is_anomaly
    })

@app.route('/api/reset')
def api_reset():
    global t_ptr
    with lock:
        t_ptr = look_back - 1
    return jsonify({'status': 'reset', 't_ptr': t_ptr})

# 執行
if __name__ == '__main__':
    print("🟣 Flask app 即將啟動...")
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=False
    )
