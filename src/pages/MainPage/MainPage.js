import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate  } from 'react-router-dom';
import { getData } from '../../util/api';
import './MainPage.style.css';

const MainPage = ({setProjectName}) => {
  const navigate = useNavigate ();
  const { data, isLoading, isError, error } = useQuery('data', () => getData('project'));
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  if(data){
    console.log(data)
  }
  setProjectName(null)
  const goToChartPage = (id, name) => {
    setProjectName(name);
    navigate(`chart/${id}`);
  }

  return (
    <div className='main-inner'>
      <ul className='pj-list'>
        {
          data.data&&data.data.map((items, index) => (
            <li onClick={() => goToChartPage(items.idx, items.pj_name)} key={items.idx}>
              <h3>{items.pj_name}</h3>
              <p>{items.pj_start_date.substr(0,10)} ~ {items.pj_end_date.substr(0,10)}</p>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default MainPage