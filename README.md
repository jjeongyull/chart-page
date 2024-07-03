# 프로젝트별 차트 보기 페이지

### 사용한 라이브러리
- axios
- react-query
- react-router
- recharts

### 사용 목적
현재 회사 내부에서 프로젝트별로 SNS 관련 수치를 월별로 입력하고 관리합니다.  
입력한 데이터가 현재는 테이블로만 표시되는데 따로 보고서 작성시 차트 작성을 위해  
별도로 차트 관리 페이지를 제작해 프로젝트 관리 페이지에 연결해 줌으로써  
회사에선 프로젝트별로 차트만 따로 볼 수있게 되었습니다.

[차트패이지연결링크](https://addit.menteimo.com/snsChart)


### 서버코드(php 실 사용중인 코드)
```php 
<?php

header("Access-Control-Allow-Origin: *"); // 모든 출처에서 접근 허용
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // 사용할 HTTP 메서드 목록
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization"); // 허용할 헤더 목록
header("Content-Type: application/json; charset=UTF-8");

// MySQL 접속 정보
$host = '';
$user = '';
$password = '';
$database = '';
$port = ;

// MySQL 연결
$conn = new mysqli($host, $user, $password, $database, $port);
$return_data = array();
$data_array = array();
// 연결 확인
if ($conn->connect_error) {
    die("MySQL 연결 실패: " . $conn->connect_error);
}
$conn->set_charset("utf8");
// 요청된 URI 가져오기
$request_uri = $_SERVER['REQUEST_URI'];


// '/' 경로에 대한 GET 요청 처리
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $request_uri === '/') {
    echo json_encode('요청완료');
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'GET' && strpos($request_uri, '/project') !== false) {
    $sql = "SELECT * FROM 테이블명";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("쿼리 준비 오류: " . $conn->error);
    }
    $stmt->execute();
    $result = $stmt->get_result(); // 결과 가져오기
  
    if ($result->num_rows > 0) {
        $data_array = array(); // 데이터 배열 초기화
        while ($row = $result->fetch_assoc()) {
            $data_array[] = $row; // 각 행을 데이터 배열에 추가
        }
        $return_data = json_encode($data_array, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); // JSON 형식으로 변환
        
        if ($return_data === false) {
            die("JSON 인코딩 오류: " . json_last_error_msg());
        }

        echo $return_data; // JSON 데이터 출력
    } else {
        echo json_encode(array()); // 데이터가 없는 경우 빈 배열 반환
    }
    exit;
}

// '/userCount/:id' 경로에 대한 GET 요청 처리
if ($_SERVER['REQUEST_METHOD'] === 'GET' && preg_match('/^\/js\/chartServer\.php\/userCount\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $projectId = $matches[1];
    $sql = "SELECT * FROM 테이블명 WHERE pj_idx = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("쿼리 준비 오류: " . $conn->error);
    }
    $stmt->bind_param("i", $projectId);
    $stmt->execute();
    $result = $stmt->get_result();
    $userCounts = array();
    while ($row = $result->fetch_assoc()) {
        $userCounts[] = $row;
    }
    $return_data = json_encode($userCounts, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); // JSON 형식으로 변환
    echo $return_data;
    exit;
}

// '/planCount/:id' 경로에 대한 GET 요청 처리
if ($_SERVER['REQUEST_METHOD'] === 'GET' && preg_match('/^\/js\/chartServer\.php\/planCount\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $projectId = $matches[1];
    $sql = "SELECT * FROM 테이블명 WHERE pj_idx = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("쿼리 준비 오류: " . $conn->error);
    }
    $stmt->bind_param("i", $projectId);
    $stmt->execute();
    $result = $stmt->get_result();
    $planCounts = array();
    while ($row = $result->fetch_assoc()) {
        $planCounts[] = $row;
    }
    $return_data = json_encode($planCounts, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); // JSON 형식으로 변환
    
    if ($return_data === false) {
        die("JSON 인코딩 오류: " . json_last_error_msg());
    }

    echo $return_data;
    exit;
}

// '/category' 경로에 대한 GET 요청 처리
if ($_SERVER['REQUEST_METHOD'] === 'GET' && strpos($request_uri, '/category') !== false) {
    $sql = "SELECT * FROM 테이블명";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("쿼리 준비 오류: " . $conn->error);
    }
    $stmt->execute();
    $result = $stmt->get_result(); // 결과 가져오기
    if ($result->num_rows > 0) {
        $data_array = array(); // 데이터 배열 초기화
        while ($row = $result->fetch_assoc()) {
            $data_array[] = $row; // 각 행을 데이터 배열에 추가
        }
        $return_data = json_encode($data_array, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); // JSON 형식으로 변환
        if ($return_data === false) {
            die("JSON 인코딩 오류: " . json_last_error_msg());
        }

        echo $return_data;
    } else {
        echo json_encode(array());
    }
    exit;
}

// 모든 요청이 매치되지 않은 경우 404 응답 반환
http_response_code(404);
echo json_encode("Not Found");
exit;
?>

```
  

### 서버코드(express 테스트 코드)
```javascript
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

// 디비 세팅
const SNSMANAGERDB = mysql.createConnection({
  host: '',
  user: "",
  password: "",
  database: "",
  port: 
})

app.get('/', (req, res) => {
  return res.json('요청완료');
});


// 프로젝트 로딩
app.get('/project', (req, res) => {
  const sql = 'SELECT * FROM 테이블명';
  SNSMANAGERDB.query(sql, (err, data) => {
    if (err) {
      console.error('MySQL 쿼리 오류:', err);
      return res.status(500).json(err); // 에러 응답
    } else {
      return res.json(data); // 성공 시 데이터 응답
    }
  });
});

// kpi카운트 로딩
app.get('/userCount/:id', (req, res) => {
  const projectId = req.params.id;
  const sql = 'SELECT * FROM 테이블명 WHERE pj_idx = ?';
  SNSMANAGERDB.query(sql, [projectId], (err, data) => {
    if (err) {
      console.error('MySQL 쿼리 오류:', err);
      return res.status(500).json(err); // 에러 응답
    } else {
      return res.json(data); // 성공 시 데이터 응답
    }
  });
});

// 목표 kpi카운트 로딩
app.get('/planCount/:id', (req, res) => {
  const projectId = req.params.id;
  const sql = 'SELECT * FROM 테이블명 WHERE pj_idx = ?';
  SNSMANAGERDB.query(sql, [projectId], (err, data) => {
    if (err) {
      console.error('MySQL 쿼리 오류:', err);
      return res.status(500).json(err); // 에러 응답
    } else {
      return res.json(data); // 성공 시 데이터 응답
    }
  });
});

// 카테고리 로딩
app.get('/category', (req, res) => {
  const projectId = req.params.id;
  const sql = 'SELECT * FROM 테이블명';
  SNSMANAGERDB.query(sql, (err, data) => {
    if (err) {
      console.error('MySQL 쿼리 오류:', err);
      return res.status(500).json(err); // 에러 응답
    } else {
      return res.json(data); // 성공 시 데이터 응답
    }
  });
});

app.listen(3336, ()=> {
  console.log('서버접속');
})
```