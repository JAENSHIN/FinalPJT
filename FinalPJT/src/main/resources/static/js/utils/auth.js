export var accessToken = 'none';
export var errCnt = 0;
export async function getAccessToken() {
    try {
        const response = await fetch('http://localhost:3000/api/getAccessToken', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.errCd === 0) {
            accessToken = data.result.accessToken; // 전역 변수 업데이트
            localStorage.setItem('sgisAccessToken', accessToken); // 로컬 스토리지에 저장

            // 액세스 토큰 발급 완료 이벤트 발생
            document.dispatchEvent(new CustomEvent('accessTokenReady', { detail: accessToken }));
        } else {
            throw new Error('Failed to get access token: ' + data.errMsg);
        }
    } catch (error) {
        console.error('Error getting access token:', error);
    }
}
