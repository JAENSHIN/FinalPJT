import { pplsummary } from './pplsummary.js';
import { gndrSummary } from './gndrSummary.js';

var accessToken = 'none';
var errCnt = 0;

// 초기 토큰 발급
getAccessToken();

async function getAccessToken() {
    try {
        const response = await fetch('http://localhost:3000/api/getAccessToken', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.accessToken) {
            accessToken = data.accessToken; // 전역 변수에 저장
            localStorage.setItem('sgisAccessToken', accessToken); // 로컬 스토리지에 저장

            // 액세스 토큰 발급 완료 이벤트 발생
            document.dispatchEvent(new CustomEvent('accessTokenReady', { detail: accessToken }));
        } else {
            throw new Error('Failed to get access token from server.');
        }
    } catch (error) {
        console.error('Error getting access token:', error);
    }
}

document.getElementById('send-coordinates').addEventListener('click', async function() {
    const longitude = document.getElementById('longitude').value; // 경도 값
    const latitude = document.getElementById('latitude').value; // 위도 값

    console.log(`Received coordinates: longitude=${longitude}, latitude=${latitude}`);

    try {
        if (accessToken === 'none') {
            console.warn('Access token is not available. Requesting a new token...');
            await getAccessToken(); // 토큰 발급 완료 후 진행
        }

        if (accessToken && accessToken !== 'none') {
            // 액세스 토큰이 유효하면 reverseGeo 호출
            await reverseGeo(longitude, latitude);
        } else {
            console.error('Access token is still not available.');
            alert('Access token could not be retrieved. Please try again later.');
        }
    } catch (error) {
        console.error('Failed to get access token.', error);
    }
});

export async function reverseGeo(longitude, latitude) {
    const addr_type = 21;

    try {
        const response = await fetch(`https://sgisapi.kostat.go.kr/OpenAPI3/addr/rgeocodewgs84.json?accessToken=${accessToken}&x_coor=${longitude}&y_coor=${latitude}&addr_type=${addr_type}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Full API response:', data); // 응답 데이터 전체를 출력하여 데이터 구조 확인

        if (data.errCd === 0) {
            if (data.result && data.result.length > 0) {
                const firstResult = data.result[0]; // 배열의 첫 번째 요소에 접근
                const adminDistrictCode = firstResult.adm_dr_cd || "코드 없음";
                const fullAddress = firstResult.full_addr || "주소 없음";

                console.log('Admin District Code:', adminDistrictCode);
                console.log('Full Address:', fullAddress);

                // pplsummary 함수 호출
                pplsummary(accessToken, adminDistrictCode);
                // gndrSummary 함수 호출
                gndrSummary(accessToken, adminDistrictCode);
            } else {
                console.warn('The result array is empty.');
            }
        } else {
            console.error('Error in response:', data.errMsg || 'Unknown error');
        }
    } catch (error) {
        console.error('Error getting geocode data:', error);
    }
}