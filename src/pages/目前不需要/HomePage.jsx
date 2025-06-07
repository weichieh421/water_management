import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="homepage-container">
      <h1 className="title">🔧 系統功能快速入口</h1>
      <div className="button-grid">
        <Link to="/ai-predict" className="card">
          即時預測與風險狀況
        </Link>
        <Link to="/ai-schedule" className="card">
          AI 調度建議模組
        </Link>
        <Link to="/history-log" className="card">
          歷史預警紀錄查詢
        </Link>
        <Link to="/auto-adjust" className="card">
          自動應變建議
        </Link>
      </div>
    </div>
  );
}
