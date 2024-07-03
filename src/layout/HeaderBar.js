import React from 'react';
import './HeaderBar.style.css';

import { Outlet } from 'react-router-dom';

const HeaderBar = ({projectName}) => {
  return (
    <div>
      <div className='header'>
        <p>{projectName? projectName : 'PROJECT KPI CHART VIEW'}</p>
      </div>
      <Outlet/>
    </div>
  )
}

export default HeaderBar