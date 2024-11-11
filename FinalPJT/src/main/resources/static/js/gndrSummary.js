export function gndrSummary(accessToken, adm_cd) {
    if (!adm_cd) {
        console.error('Administrative code (adm_cd) is not available.');
        return; // adm_cd가 없으면 함수를 종료
    }
    
    if (!accessToken) {
        console.error('Access token is not available. Please obtain a new token.');
        return; // accessToken이 없으면 함수를 종료
    }

    fetch(`https://sgisapi.kostat.go.kr/OpenAPI3/startupbiz/mfratiosummary.json?accessToken=${accessToken}&adm_cd=${adm_cd}`, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (parseInt(data.errCd) === 0) {
            // 데이터 파싱
            const result = data.result[0];
            if (result) {
				console.log('행정구역 이름:', result.adm_nm);
                console.log('전체인구:', result.total_ppl	);
				console.log('여자인구:', result.f_ppl);
				console.log('남자인구:', result.m_ppl);
                console.log('여자비율:', result.f_per);
				console.log('남자비율:', result.m_per);
				
				
            } else {
                console.warn('No result found in response data.');
            }
        } else if (parseInt(data.errCd) === -401) {
            errCnt++;
            if (errCnt < 5) {
                console.warn('Access token expired, retrying to get a new one...');
                getAccessToken().then(() => {
                    pplsummary(accessToken, adm_cd); // 새로운 토큰 발급 후 다시 요청
                }).catch(() => {
                    console.error('Failed to obtain a new access token.');
                });
            } else {
                console.error('Exceeded retry limit for access token.');
            }
        } else if (parseInt(data.errCd) === -100) {
            console.error('Invalid address or no results found.');
        } else {
            console.error('Unexpected error code:', data.errCd);
        }
    })
    .catch(error => {
        console.error('Error getting population summary data:', error);
    });
}
