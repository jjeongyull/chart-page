import React, { useState } from 'react';
import './ChartPage.style.css';
import { useParams } from 'react-router-dom';
import { getData } from '../../util/api';
import { useQuery } from 'react-query';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

// 함수
import MakeJsonFunction from '../../util/makeChartJson';

const ChartPage = () => {
  const [chartData, setChartData] = useState(null); // 차트데이터
  const [chartType, setChartType] = useState('line'); // 기본 차트 유형 설정
  const [activeMonth, setActiveMonth] = useState(null); // 활성화된 월 상태

  const [userKpiCountList, setUserKpiCountList] = useState(null); // 월별 kpi카운트
  const [planKpiCountList, setPlanKpiCountList] = useState(null); // 목표 kpi카운트
  const [categoryList, setCategoryList] = useState(null); // 카테고리 리스트

  const { id } = useParams();

  // 데이터 받아오기 ===================================================================
  const { data: userKpiCount, isLoading: userKpiLoading, isError: userKpiError, error: userKpiErrorData } = useQuery(['userCount', id], () => getData('userCount', id), {
    onSuccess: (data) => {
      setUserKpiCountList(data.data);
    }
  });
  const { data: planKpiCount, isLoading: planKpiLoading, isError: planKpiError, error: planKpiErrorData } = useQuery(['planCount', id], () => getData('planCount', id), {
    onSuccess: (data) => {
      setPlanKpiCountList(data.data);
    }
  });
  const { data: category, isLoading: categoryLoading, isError: categoryError, error: categoryErrorData } = useQuery('category', () => getData('category'), {
    onSuccess: (data) => {
      setCategoryList(data.data);
    }
  });

  if (userKpiLoading || planKpiLoading || categoryLoading) return <p>Loading...</p>;
  if (userKpiError) {
    return <p>Error in userKpiCount query: {userKpiError.message}</p>;
  }
  if (planKpiError) {
    return <p>Error in planKpiCount query: {planKpiError.message}</p>;
  }
  if (categoryError) {
    return <p>Error in category query: {categoryError.message}</p>;
  }
  // =================================================================================

  let monthList = MakeJsonFunction.makeMontList(userKpiCountList);

  // 월 클릭시 해당 차트에 데이터 출력
  const viewChartMont = (month) => {

    let chartDataList = MakeJsonFunction.makeChartData(userKpiCountList, planKpiCountList, categoryList, month);
    console.log(chartDataList)
    console.log(userKpiCountList)
    console.log(planKpiCountList)
    setChartData(chartDataList);
    setActiveMonth(month);
  }

  // 차트 유형 변경 함수
  const changeChartType = (type) => {
    setChartType(type);
  }

  return (
    <div>
      <ul className='month-list'>
        {
          monthList && monthList.map((items, index) => (
            <li 
              onClick={() => viewChartMont(items)} 
              className={`month-list-li ${items === activeMonth ? 'active' : ''}`}
              key={index}>
                {items}
            </li>
          ))
        }
      </ul>

      <div>
        {
          chartData ? (
            <div className='chart-div'>
              <div className='chart-btn-list'>
                <button onClick={() => changeChartType('line')}>Line Chart</button>
                <button onClick={() => changeChartType('bar')}>Bar Chart</button>
                <button onClick={() => changeChartType('area')}>Area Chart</button>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                {chartType === 'line' && (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="realCount" name="사용자 수" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="plan_count" name="목표 수" stroke="#f17c7c" />
                    <Line type="monotone" dataKey="org_count" name="수행전 수" stroke="#000" />
                  </LineChart>
                )}
                {chartType === 'bar' && (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="realCount" name="사용자 수" fill="#8884d8" />
                    <Bar dataKey="plan_count" name="목표 수" fill="#f17c7c" />
                    <Bar dataKey="org_count" name="수행전 수" fill="#000" />
                  </BarChart>
                )}
                {chartType === 'area' && (
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="realCount" name="사용자 수" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="plan_count" name="목표 수" stroke="#f17c7c" fill="#f17c7c" />
                    <Area type="monotone" dataKey="org_count" name="수행전 수" stroke="#000" fill="#000" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          ) : (
            <p className='none-chart'>월을 클릭하여 선택하세요</p>
          )
        }
      </div>
    </div>
  );
}

export default ChartPage;
