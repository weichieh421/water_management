import React from "react";
import HistoricalAlerts from "../components/HistoricalAlerts";
import "./HistoryLog.css";  // 新增這行：引入專屬 CSS

export default function HistoryLog() {
  return (
    <div className="history-page-wrapper">
      <HistoricalAlerts />
    </div>
  );
}
