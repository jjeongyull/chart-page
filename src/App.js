import './App.css';
import { Routes, Route } from 'react-router-dom';

// header
import HeaderBar from './layout/HeaderBar';
// page
import MainPage from './pages/MainPage/MainPage';
import ChartPage from './pages/ChartPage/ChartPage';
import { useState } from 'react';

/**
 * 페이지 
 * 프로젝트리스트 출력 페이지(메인)
 * 차트 페이지
 */

function App() {
  const [projectName, setProjectName] = useState(null);

  return (
    <div className='wrap'>
      <Routes>
        <Route path='/' element={<HeaderBar projectName={projectName}/>}>
          <Route index element={<MainPage setProjectName={setProjectName}/>}/>
          <Route path='/chart/:id' element={<ChartPage/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
