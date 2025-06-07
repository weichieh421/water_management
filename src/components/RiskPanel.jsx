import React, { useEffect, useState } from 'react';

const RiskPanel = () => {
  const [status, setStatus] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchStatus = () => {
      fetch('http://127.0.0.1:5000/api/status')
        .then((res) => res.json())
        .then((data) => {
          setStatus(data);
          setShowAlert(data.anomaly === true);
        });
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!status || status.status === 'no_data') return <div>資料載入中...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          border: '2px solid',
          borderColor: status.anomaly ? 'red' : 'green',
          backgroundColor: status.anomaly ? '#ffe5e5' : '#e6ffe6',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1rem',
        }}
      >
        <h2>用水風險預測</h2>
        <p>實際用水量：{status.actual}</p>
        <p>預測用水量：{status.predicted}</p>
        <p>差異：{status.diff}</p>
        <p>異常：{status.anomaly ? '⚠️ 是' : '✅ 否'}</p>
      </div>

      <div>
        <h3>天氣雷達圖</h3>
        <img
          src="https://www.cwa.gov.tw/Data/satellite/LCC_VIS/latest.jpg"
          alt="即時天氣圖"
          style={{ width: '100%', borderRadius: '8px' }}
        />
      </div>

      {showAlert && (
        <div
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'red',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          ⚠️ 用水異常警報：超過預測值 10%
        </div>
      )}
    </div>
  );
};

export default RiskPanel;
