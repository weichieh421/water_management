import React, { useState } from "react";
import styles from "./RealTimeForecast.module.css";


const mockData = [
  {
    id: 1,
    location: "地區 A",
    date: "2025-06-06",
    level: "High",
    description: "豪雨來襲，水庫需快速調節",
    suggestion: "立即開啟第 2 號排洪閘門"
  },
  {
    id: 2,
    location: "地區 B",
    date: "2025-06-06",
    level: "Medium",
    description: "降雨中等，密切監控",
    suggestion: "保持目前出水量"
  },
  {
    id: 3,
    location: "地區 C",
    date: "2025-06-06",
    level: "Low",
    description: "氣候穩定",
    suggestion: "維持現況即可"
  },
  {
    id: 4,
    location: "地區 D",
    date: "2025-06-05",
    level: "High",
    description: "雷雨交加，壩體壓力上升",
    suggestion: "減少蓄水量並通知後端備援"
  },
  {
    id: 5,
    location: "地區 E",
    date: "2025-06-05",
    level: "Low",
    description: "風和日麗，無明顯風險",
    suggestion: "監控即可，無需調整"
  },
  {
    id: 6,
    location: "地區 F",
    date: "2025-06-05",
    level: "Medium",
    description: "短時強降雨可能發生",
    suggestion: "預先降低水位 1 米"
  },
  {
    id: 7,
    location: "地區 G",
    date: "2025-06-04",
    level: "High",
    description: "山區降雨超過警戒值",
    suggestion: "即刻封閉上游進水閘門"
  },
  {
    id: 8,
    location: "地區 H",
    date: "2025-06-04",
    level: "Low",
    description: "降雨量極小，風險低",
    suggestion: "照常運行"
  },
  {
    id: 9,
    location: "地區 I",
    date: "2025-06-03",
    level: "Medium",
    description: "水庫水位波動異常",
    suggestion: "派遣人員現場檢查"
  },
  {
    id: 10,
    location: "地區 J",
    date: "2025-06-03",
    level: "Low",
    description: "週邊氣壓穩定",
    suggestion: "例行監測即可"
  },
  {
    id: 11,
    location: "地區 K",
    date: "2025-06-02",
    level: "High",
    description: "預測 6 小時內有強降雨",
    suggestion: "提前打開下游洩洪通道"
  },
  {
    id: 12,
    location: "地區 L",
    date: "2025-06-02",
    level: "Medium",
    description: "氣象局發出注意報",
    suggestion: "依預報調整調度策略"
  },
  {
    id: 13,
    location: "地區 M",
    date: "2025-06-01",
    level: "Low",
    description: "連續晴天，水位下降",
    suggestion: "考慮減少出水量"
  }
];

const RealTimeForecast = () => {
  const [filterLevel, setFilterLevel] = useState("");
  const filteredData =
    filterLevel === ""
      ? mockData
      : mockData.filter((d) => d.level === filterLevel);

  const levelColor = {
    High: styles.high,
    Medium: styles.medium,
    Low: styles.low
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead><h2>即時預測與風險狀況</h2>
          <div className={styles.filterBar}>
        <label>風險等級：</label>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
        >
          <option value="">所有等級</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
            <tr>
              <th>地區</th>
              <th>時間</th>
              <th>風險等級</th>
              <th>預測描述</th>
              <th>調度建議</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.location}</td>
                <td>{item.date}</td>
                <td className={levelColor[item.level]}>{item.level}</td>
                <td>{item.description}</td>
                <td>{item.suggestion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RealTimeForecast;
