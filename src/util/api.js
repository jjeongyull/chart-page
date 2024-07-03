import axios from 'axios';

const BASE_URL = 'https://www.menteimo.com/js/chartServer.php'; // API의 기본 URL

// 예시 API 호출 함수
export const getData = async (url, id="") => {
  try {
    let response;
    if(id !== ""){
      response = await axios.get(`${BASE_URL}/${url}/${id}`);
    }else{
      response = await axios.get(`${BASE_URL}/${url}`);
    }

    return response; // API 응답 데이터 반환
  } catch (error) {
    throw new Error(error.response.data.error); // 에러 발생 시 처리
  }
};
