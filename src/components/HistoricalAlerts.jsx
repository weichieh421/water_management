// 路徑：src/components/HistoricalAlerts.jsx
import React from "react";
import "./HistoricalAlerts.css";

export default function HistoricalAlerts() {
  return (
    <div className="history-container">
      {/* 1. 全幅 Header 標題列 */}
      <div className="history-header-bar">
        <h2>歷史預警紀錄</h2>
      </div>

      {/* 2. 篩選區：Date Range、All Levels、Search 按鈕 */}
      <div className="history-filters-bar">
        <input type="text" placeholder="日期範圍" />
        <select>
          <option>所有事件</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button>搜尋</button>
      </div>

      {/* 3. 可水平滾動的表格 */}
      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
           <tr>
              <th>日期</th>
              <th>等級</th>
              <th>事件說明</th>
              <th>應變措施</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-05-01</td>
              <td className="level-high">High</td>
              <td>水庫水位超過安全閾值，需立即調度下游出流</td>
              <td>
                <button
                  className="view-button"
                  onClick={() => handleViewClick(item.id)}
                >
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td>2025-04-20</td>
              <td className="level-low">Low</td>
              <td>監測到強降雨，但目前流量尚未達警戒</td>
              <td>
                <button
                  className="view-button"
                  onClick={() => handleViewClick(item.id)}
                >
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td>2025-04-10</td>
              <td className="level-high">High</td>
              <td>水質檢測發現重金屬超標，可能影響飲用水安全</td>
              <td>
                <button
                  className="view-button"
                  onClick={() => handleViewClick(item.id)}
                >
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td>2025-04-05</td>
              <td className="level-medium">Medium</td>
              <td>河川流量持續偏高，需要加強巡查與排水</td>
              <td>
                <button
                  className="view-button"
                  onClick={() => handleViewClick(item.id)}
                >
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td>2025-03-26</td>
              <td className="level-low">Low</td>
              <td>大氣壓系統穩定，暫無明顯異常</td>
              <td>
                <button
                  className="view-button"
                  onClick={() => handleViewClick(item.id)}
                >
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td>2025-03-19</td>
              <td className="level-medium">Medium</td>
              <td>中度降雨導致土壤含水量提升，需注意邊坡安全</td>
              <td>
                <button
                  className="view-button"
                  onClick={() => handleViewClick(item.id)}
                >
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td>2025-02-17</td>
              <td className="level-low">Low</td>
              <td>日照正常，水位維持穩定，無需特別應變</td>
              <td>
                <button
                  className="view-button"
                  onClick={() => handleViewClick(item.id)}
                >
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td>2025-02-01</td>
              <td className="level-low">Low</td>
              <td>檢測到輕微汙染，需後續採樣確認來源</td>
              <td>
                <button
                  className="view-button"
                  onClick={() => handleViewClick(item.id)}
                >
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td>2025-01-14</td>
              <td className="level-low">Low</td>
              <td>水庫進行例行清淤維護，暫時降低蓄水量</td>
              <td>
                <button
                  className="view-button"
                  onClick={() => handleViewClick(item.id)}
                >
                  View
                </button>
              </td>
            </tr>
            {/* 新增第 9 筆 */}
            <tr>
              <td>2025-01-03</td>
              <td className="level-medium">Medium</td>
              <td>上游流域突發洪峰，需加強下游排水管控</td>
              <td>
                <button
                  className="view-button"
                  onClick={() => handleViewClick(item.id)}
                >
                  View
                </button>
              </td>
            </tr>
            {/* 新增第 10 筆 */}
            <tr>
              <td>2024-12-20</td>
              <td className="level-high">High</td>
              <td>下游土石流警戒提升，緊急撤離邊坡居民</td>
              <td>
                <button
                  className="view-button"
                  onClick={() => handleViewClick(item.id)}
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
       </table>
     </div>

      {/* 4. 全幅分頁列 */}
      <div className="history-pagination-bar">
        <span>Page 1 of 10</span>
      </div>
    </div>
  );
}
