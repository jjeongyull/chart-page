const MakeJsonFunction = {};

/**
 * 
 * @param {*} pData : 월별 kpi지수가 입력된 데이터
 * @param {*} planData : 목표데이터
 * @param {*} categoryList : 카테고리데이터
 * @param {*} month : 기준 월
 */
const makeChartData = (pData, planData, categoryList, selectedMonth) => {
  const result = [];

  // 선택된 월에 해당하는 데이터 필터링
  const filteredData = pData.filter(item => item.kpi_month.substr(0, 7) === selectedMonth);

  const filterPlan = Object.values(
    planData.reduce((acc, current) => {
      const { pj_ca_idx, write_date } = current;
      if (!acc[pj_ca_idx] || new Date(acc[pj_ca_idx].write_date) < new Date(write_date)) {
        acc[pj_ca_idx] = current;
      }
      return acc;
    }, {})
  );

  // planData를 기준으로 데이터 매핑
  for (let i = 0; i < filterPlan.length; i++) {
    const planItem = filterPlan[i];
    const tempJson = {
      org_count: planItem.org_count,
      plan_count: planItem.plan_count,
      realCount: null, // 초기값 설정
      name: '' // 초기값 설정
    };

    // planData와 filteredData를 비교하여 데이터 매핑
    const foundData = filteredData.find(item => Number(planItem.pj_ca_idx) === Number(item.kpi_ca_idx));
    if (foundData) {
      tempJson.realCount = foundData.kpi_count;
      const category = categoryList.find(cat => Number(planItem.pj_ca_idx) === Number(cat.idx));
      if (category) {
        tempJson.name = category.ca_name;
      }
    }

    result.push(tempJson);
  }

  return result;
};

const makeMontList = (pData) => {
  if (!pData) return [];

  let monthList = [];
  for(let i = 0; i < pData.length; i++){
    let month = pData[i].kpi_month.substr(0, 7);
    monthList.push(month);
  }
  monthList = Array.from(new Set(monthList));
  return monthList;
}


MakeJsonFunction.makeChartData = makeChartData;
MakeJsonFunction.makeMontList = makeMontList;


export default MakeJsonFunction;