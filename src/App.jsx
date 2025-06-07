import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OverviewPage from './pages/OverviewPage'; 
import AutoAdjust from './pages/AutoAdjust'; 
import AIPredict from './pages/AIPredict'; 
import AISchedule from './pages/AISchedule';
import HistoryLog from './pages/HistoryLog'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OverviewPage />} />  
        <Route path="/autoadjust" element={<AutoAdjust />} />
        <Route path="/aipredict" element={<AIPredict />} />
        <Route path="/aischedule" element={<AISchedule />} />
        <Route path="/historylog" element={<HistoryLog />} />
    </Routes>

    </BrowserRouter>
  );
}

export default App;
