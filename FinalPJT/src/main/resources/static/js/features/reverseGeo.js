import { pplsummary } from './pplsummary.js';
import { createGenderChart } from "../ui/populationChart.js";
import { getAccessToken, accessToken } from '../utils/auth.js';


// 초기 토큰 발급
getAccessToken();

export function gndrSummary(accessToken, adm_cd) {
    fetch(`https://sgisapi.kostat.go.kr/OpenAPI3/startupbiz/mfratiosummary.json?accessToken=${accessToken}&adm_cd=${adm_cd}`)
        .then(response => response.json())
        .then(data => {
            if (data.errCd === 0) {
                const result = data.result[0];
                if (result) {
                    const genderData = {
                        male: result.m_ppl,
                        female: result.f_ppl
                    };
                    createGenderChart(genderData);
                }
            }
        });
}


document.addEventListener("DOMContentLoaded", () => {
    //console.log("DOM fully loaded and parsed.");
    // 추가적인 초기화 작업이 있다면 이곳에 작성
});


export function reverseGeo(longitude, latitude) {
    const addr_type = 21;

    fetch(`https://sgisapi.kostat.go.kr/OpenAPI3/addr/rgeocodewgs84.json?accessToken=${accessToken}&x_coor=${longitude}&y_coor=${latitude}&addr_type=${addr_type}`, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        //console.log('Full API response:', data); // 응답 데이터 전체를 출력하여 데이터 구조 확인

        if (data.errCd === 0) {
            // result는 배열이므로 배열의 첫 번째 요소에 접근해야 합니다.
            if (data.result && data.result.length > 0) {
                const firstResult = data.result[0]; // 배열의 첫 번째 요소에 접근
                const adminDistrictCode = firstResult.adm_dr_cd;
                const fullAddress = firstResult.full_addr;

               // console.log('Admin District Code:', adminDistrictCode);
                //console.log('Full Address:', fullAddress);

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
    })
    .catch(error => {
        console.error('Error getting geocode data:', error);
    });
}
