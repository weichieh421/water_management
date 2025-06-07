import React, { useState, useEffect } from "react";
import "./AISchedulingModule.css";

/**
 * AI 建議調度模組
 * - 會呈現多筆建議方案
 * - 「View」按鈕暫時只是個 placeholder，日後可以接到歷史資料畫面
 */
const AISchedulingModule = () => {
  // 模擬從 API 拿到的建議調度方案陣列
  const [suggestions, setSuggestions] = useState([]);

  // 這邊 useEffect 僅示範在元件載入時塞入假資料，實際可改成 fetch API
  useEffect(() => {
    const fakeData = [
      {
        id: 1,
        planName: "調度方案 A",
        description: "優先調整北部地區水庫進水量，以支撐下游需求。",
        projectedBenefit: "節省 10% 用水量",
      },
      {
        id: 2,
        planName: "調度方案 B",
        description: "採用跨流域調度，增加中南部地下水抽補。",
        projectedBenefit: "穩定供水 80 萬度電",
      },
      {
        id: 3,
        planName: "調度方案 C",
        description: "啟動西部農田節水措施，並調降工業用水抽取限額。",
        projectedBenefit: "減少 5 百萬噸污水排放",
      },
      {
        id: 4,
        planName: "調度方案 D",
        description: "wjvrwovd",
        projectedBenefit: "vdswejhvioeq",
      },
      {
        id: 5,
        planName: "調度方案 E",
        description: "eqvelwjvrwovd",
        projectedBenefit: "djhvbtesioe",
      },
    ];

    setSuggestions(fakeData);
  }, []);

  // 按下「View」按鈕的 handler
  const handleViewClick = (id) => {
    // 暫時只是 console.log，日後可以 router 導到歷史資料頁面
    console.log(`點擊了 View 按鈕，方案 id = ${id}，可跳轉到歷史資料`);
    // 例如：
    // navigate(`/history/${id}`);
  };

  return (
    <div className="module-container">
      {/* 模組標題 */}
      <div className="module-header">AI 調度建議</div>

      {/* 資料表 */}
      <div className="table-wrapper">
        <table className="suggestions-table">
          <thead>
            <tr>
              <th>編號</th>
              <th>方案名稱</th>
              <th>說明</th>
              <th>預期效益</th>
              <th>歷史資料</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.planName}</td>
                <td>{item.description}</td>
                <td>{item.projectedBenefit}</td>
                <td>
                  <button
                    className="view-button"
                    onClick={() => handleViewClick(item.id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {/* 如果目前沒有建議，也可以顯示「暫無資料」 */}
            {suggestions.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                  暫無建議調度方案
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AISchedulingModule;
