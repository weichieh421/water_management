import React from 'react';
import './OverviewPage.css';

const OverviewPage = () => {
  return (
    <div className="overview-container">
      <h1 className="overview-title">水資源地圖總覽</h1>

      {/* 地圖區塊 */}
      <div className="card">
        <h2 className="section-title">地圖顯示區塊</h2>
        <div className="map-placeholder">
          <p>📍 這裡會放 Leaflet 或 Mapbox 顯示水資源區域與顏色</p>
        </div>
        <ul className="note">
          <li>點擊地圖區域可查看詳細水量資訊</li>
          <li>顏色標示：<span style={{ color: 'red' }}>紅＝缺水</span>，<span style={{ color: 'orange' }}>黃＝偏低</span>，<span style={{ color: 'green' }}>綠＝正常</span></li>
        </ul>
      </div>

      {/* 天氣資料區塊 */}
      <div className="card">
        <h2 className="section-title">即時天氣與水量資訊</h2>
        <div className="weather-grid">
          {[
            { city: '台北市', temp: '28°C', rain: '60%', level: '70%' },
            { city: '高雄市', temp: '30°C', rain: '30%', level: '55%' },
            { city: '台中市', temp: '27°C', rain: '40%', level: '85%' },
          ].map((info, i) => (
            <div key={i} className="weather-card">
              <p className="card-title">{info.city}</p>
              <p>🌡 溫度：{info.temp}</p>
              <p>🌧 降雨機率：{info.rain}</p>
              <p>💧 目前蓄水量：{info.level}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 功能快速入口 */}
      <div className="card">
        <h2 className="section-title">🔧 系統功能快速入口</h2>
        <div className="feature-grid">
          <a href="/AIPredict" className="feature-button status">即時預測與風險狀況</a>
          <a href="/AISchedule" className="feature-button dispatch">AI 調度建議模組</a>
          <a href="/HistoryLog" className="feature-button history">歷史預警紀錄查詢</a>
          <a href="/AutoAdjust" className="feature-button auto">自動應變建議</a>
          <a href="/monitor.html" target="_blank" rel="noopener noreferrer" className="feature-button monitor">即時數據監測</a>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
