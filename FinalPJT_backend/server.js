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
import axios from 'axios';

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

// 나머지 코드는 그대로 유지됩니다...

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

// 새로운 액세스 토큰 발급 엔드포인트
app.get('/api/getAccessToken', async (req, res) => {
    const url = `https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json?consumer_key=${process.env.CONSUMER_KEY}&consumer_secret=${process.env.CONSUMER_SECRET}`;
    
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

// 공공 데이터 API 요청을 프록시하는 라우트 추가
app.get('/api/storeListInRadius', async (req, res) => {
    const { latitude, longitude, radius, pageNo } = req.query;

    const url = `https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRadius?serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=10&radius=${radius}&cx=${longitude}&cy=${latitude}&type=json`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        res.status(500).send('서버에서 데이터를 가져오는 중 오류가 발생했습니다.');
    }
});

app.get('/api/kakao-api-key', (req, res) => {
    res.json({ apiKey: process.env.KAKAO_MAP_API_KEY });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
