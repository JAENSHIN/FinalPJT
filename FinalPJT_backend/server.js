import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2/promise';
import fetch from 'node-fetch';
import xml2js from 'xml2js';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { promisify } from 'util';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:8080', // 프론트엔드가 실행되는 포트를 허용
    methods: ['GET', 'POST'], // 필요한 메서드만 허용
    credentials: true
}));

// JSON 파싱 미들웨어
app.use(express.json());

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, 'public')));

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function getDBConnection() {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
}

const serviceKey = process.env.SERVICE_KEY;
const numOfRows = 2000; // 가능한 최대값으로 설정
const delayBetweenRequests = 500; // 요청 간 500ms 지연
const maxRetries = 3; // 최대 재시도 횟수
const maxRequestsPerDay = 100; // 하루 최대 요청 수
let requestCount = 0;

const sleep = promisify(setTimeout);

// 에러 로그 파일 설정
const logFilePath = path.join(__dirname, 'error.log');

function logError(error) {
    const errorMessage = `[${new Date().toISOString()}] ${error.stack}\n`;
    fs.appendFile(logFilePath, errorMessage, (err) => {
        if (err) {
            console.error('Failed to write to error log file:', err);
        }
    });
}

function logAPIRequest(pageNo, data) {
    const logEntry = `[${new Date().toISOString()}] Page ${pageNo} Response:\n${data}\n\n`;
    fs.appendFile(path.join(__dirname, 'api.log'), logEntry, (err) => {
        if (err) {
            console.error('Failed to write to API log file:', err);
        }
    });
}

function logAPIError(pageNo, errorMsg, authMsg, code) {
    const logEntry = `[${new Date().toISOString()}] API Error on page ${pageNo}: ${errorMsg}, Message: ${authMsg}, Code: ${code}\n\n`;
    fs.appendFile(path.join(__dirname, 'api.log'), logEntry, (err) => {
        if (err) {
            console.error('Failed to write to API log file:', err);
        }
    });
}

// 날짜 검증 함수
function isValidDate(dateString) {
    // 날짜 형식이 YYYY-MM-DD인지 확인
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    const timestamp = date.getTime();

    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;

    return date.toISOString().startsWith(dateString);
}

async function fetchAndStoreData() {
    let pageNo = 1;
    let totalPages = 1;

    try {
        const connection = await getDBConnection();
        await connection.beginTransaction(); // 트랜잭션 시작

        while (pageNo <= totalPages) {
            if (requestCount >= maxRequestsPerDay) {
                console.warn('Max daily request limit reached. Stopping data fetch.');
                break;
            }

            let retries = 0;
            let success = false;

            while (retries < maxRetries && !success) {
                const url = `https://apis.data.go.kr/1421000/mssBizService_v2/getbizList_v2?serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}`;
                try {
                    const response = await fetch(url);
                    const data = await response.text();
                    requestCount++;

                    // 응답 데이터 로그 파일에 기록
                    logAPIRequest(pageNo, data);

                    // 응답 데이터 로그 출력
                    console.log(`\n----- API Response for Page ${pageNo} -----\n`);
                    console.log(data);
                    console.log(`\n----- End of API Response for Page ${pageNo} -----\n`);

                    const parser = new xml2js.Parser();
                    let result;
                    try {
                        result = await parser.parseStringPromise(data);
                    } catch (parseError) {
                        console.error(`XML Parsing error on page ${pageNo}:`, parseError);
                        logError(parseError);
                        break;
                    }

                    // 응답 구조 확인
                    if (!result.response || !result.response.body) {
                        // 오류 메시지 확인
                        if (result.OpenAPI_ServiceResponse && result.OpenAPI_ServiceResponse.cmmMsgHeader) {
                            const errMsg = result.OpenAPI_ServiceResponse.cmmMsgHeader[0].errMsg[0];
                            const returnAuthMsg = result.OpenAPI_ServiceResponse.cmmMsgHeader[0].returnAuthMsg[0];
                            const returnReasonCode = result.OpenAPI_ServiceResponse.cmmMsgHeader[0].returnReasonCode[0];

                            console.error(`API Error on page ${pageNo}: ${errMsg}, Message: ${returnAuthMsg}, Code: ${returnReasonCode}`);
                            logAPIError(pageNo, errMsg, returnAuthMsg, returnReasonCode);

                            if (returnReasonCode === '22') { // 서비스 요청 제한 오류 코드
                                retries++;
                                if (retries >= maxRetries) {
                                    console.warn(`Max retries reached for page ${pageNo}. Skipping...`);
                                    break;
                                }
                                const backoffTime = delayBetweenRequests * Math.pow(2, retries); // 지수 백오프
                                console.log(`Retrying page ${pageNo} after ${backoffTime}ms... (Retry ${retries}/${maxRetries})`);
                                await sleep(backoffTime);
                                continue; // 재시도
                            }
                        } else {
                            console.error(`Unexpected API response structure on page ${pageNo}:`, result);
                            logAPIError(pageNo, 'Unexpected response', 'N/A', 'N/A');
                        }
                        break;
                    }

                    // 정상적인 응답 처리
                    if (pageNo === 1) {
                        const totalCount = parseInt(result.response.body[0].totalCount[0], 10);
                        totalPages = Math.ceil(totalCount / numOfRows);
                    }

                    const items = result.response.body[0].items[0].item;
                    const records = [];

                    for (const item of items) {
                        if (!item.title || !item.dataContents) {
                            console.warn(`Missing title or dataContents in item:`, item);
                            continue;
                        }

                        const applicationStartDateRaw = item.applicationStartDate[0];
                        const applicationEndDateRaw = item.applicationEndDate[0];

                        const applicationStartDate = isValidDate(applicationStartDateRaw) ? applicationStartDateRaw : null;
                        const applicationEndDate = isValidDate(applicationEndDateRaw) ? applicationEndDateRaw : null;

                        if (!applicationStartDate || !applicationEndDate) {
                            console.warn(`Invalid date found in item:`, item);
                            logAPIError(pageNo, 'Invalid date format', `applicationStartDate: ${applicationStartDateRaw}, applicationEndDate: ${applicationEndDateRaw}`, 'N/A');
                        }

                        const record = {
                            title: item.title[0] || "제목 없음",
                            dataContents: item.dataContents[0] || "내용 없음",
                            writerName: item.writerName[0] || "정보 없음",
                            writerPosition: item.writerPosition[0] || "내용 없음",
                            writerPhone: item.writerPhone[0] || "정보 없음",
                            writerEmail: item.writerEmail[0] || "내용 없음",
                            applicationStartDate: applicationStartDate,
                            applicationEndDate: applicationEndDate,
                            viewUrl: item.viewUrl[0] || "내용 없음",
                        };
                        records.push(record);
                    }

                    if (pageNo === 1) {
                        await connection.execute('DELETE FROM biz_list');
                    }

                    const insertQuery = `
                        INSERT INTO biz_list 
                        (title, dataContents, writerName, writerPosition, writerPhone, writerEmail, applicationStartDate, applicationEndDate, viewUrl) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    for (const record of records) {
                        try {
                            console.log(`Inserting record with dataContents length: ${record.dataContents.length}`);
                            await connection.execute(insertQuery, [
                                record.title,
                                record.dataContents,
                                record.writerName,
                                record.writerPosition,
                                record.writerPhone,
                                record.writerEmail,
                                record.applicationStartDate,
                                record.applicationEndDate,
                                record.viewUrl,
                            ]);
                        } catch (insertError) {
                            console.error('Error inserting record:', insertError);
                            logError(insertError);
                        }
                    }

                    console.log(`Page ${pageNo} data stored.`);
                    pageNo++;
                    success = true;

                    await sleep(delayBetweenRequests);
                } catch (error) {
                    console.error('Error fetching data on page:', pageNo, error);
                    logError(error);
                    retries++;
                    if (retries >= maxRetries) {
                        console.warn(`Max retries reached for page ${pageNo}. Skipping...`);
                        break;
                    }
                    const backoffTime = delayBetweenRequests * Math.pow(2, retries);
                    console.log(`Retrying page ${pageNo} after ${backoffTime}ms... (Retry ${retries}/${maxRetries})`);
                    await sleep(backoffTime);
                }
            }
        }

        await connection.commit();
        await connection.end();
        console.log('All data fetched and stored.');
    } catch (error) {
        console.error('Error fetching and storing data:', error);
        logError(error);
        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error('Error during transaction rollback:', rollbackError);
            logError(rollbackError);
        }
    }
}

// 하루가 시작될 때 요청 수를 초기화
cron.schedule('0 0 * * *', () => {
    requestCount = 0;
    console.log('Daily request count reset.');
});

// 초기 데이터 로드
fetchAndStoreData();

// 정기적으로 데이터 업데이트 (매일 새벽 2시에 실행)
cron.schedule('0 2 * * *', () => {
    console.log('Starting scheduled data fetch...');
    fetchAndStoreData();
});

// 정적 파일 제공
app.use(express.static('C:\\Users\\gram\\git\\FinalPJT\\FinalPJT\\src\\main\\resources\\templates'));

// API 엔드포인트: /api/getData?page=1&numOfRows=5
app.get('/api/getData', async (req, res) => {
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.numOfRows, 10);

    // 기본값 설정 및 유효성 검사
    if (isNaN(page) || page < 1) {
        page = 1;
    }
    if (isNaN(limit) || limit < 1) {
        limit = 5;
    }

    const offset = (page - 1) * limit;

    console.log('LIMIT:', limit, 'OFFSET:', offset); // 디버깅 로그 추가

    try {
        const connection = await getDBConnection();

        // 레코드 개수 쿼리
        const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM biz_list');
        const totalCount = countResult[0].count;
        const totalPages = Math.ceil(totalCount / limit);

		const query = `SELECT * FROM biz_list ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
		const [rows] = await connection.query(query);		
		
        await connection.end();

        // 결과 응답
        res.json({
            pageNo: page,
            numOfRows: limit,
            totalCount: totalCount,
            totalPages: totalPages,
            items: rows,
        });
    } catch (error) {
        console.error('Error fetching data from DB:', error.message);
        console.error('Stack Trace:', error.stack);
        res.status(500).json({ error: 'Internal Server Error: ' + error.message });
    }
});

// 환경 변수에서 키 값 가져오기
const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;

// 새로운 액세스 토큰 발급 엔드포인트
app.get('/api/getAccessToken', async (req, res) => {
    const url = `https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.errCd === 0) {
            res.json({ accessToken: data.result.accessToken });
        } else {
            res.status(400).json({ error: 'Failed to get access token', message: data.errMsg });
        }
    } catch (error) {
        console.error('Error getting access token:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/*// 모든 다른 요청에 대해 index.html 제공
app.get('*', (req, res) => {
    res.sendFile('C:\\Users\\gram\\git\\FinalPJT\\FinalPJT\\src\\main\\resources\\templates\\inform.html');
});*/

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
