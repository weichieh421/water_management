import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>🌊 歡迎來到水資源預測系統</h1>
      <p>這是我自訂的首頁。</p>

      {/* 舊儀表板連結 */}
      <a
        href="/monitor.html"
        target="_blank"
        rel="noopener noreferrer"
        className="btn"
      >
        🔍 前往數據監控
      </a>

      {/* 新的 React 內部頁面按鈕 */}
      <Link to="/overview" className="btn">
        📊 前往水資源總覽
      </Link>
    </div>
  );
}

export default Home;
