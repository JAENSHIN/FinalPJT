	var accessToken = 'none';
	var errCnt = 0;
	
	// 초기 토큰 발급
	getAccessToken();
	
	function getAccessToken() {
	    const consumerKey = '796b2cf0ce594c6c94aa';
	    const consumerSecret = 'cc6d2a85a4304c6f88ba';

	    // 쿼리 파라미터 방식으로 URL 구성
	    const url = `https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

	    fetch(url, {
	        method: 'GET', // GET 요청으로 변경
	    })
	    .then(response => {
	        if (!response.ok) {
	            throw new Error(`HTTP error! status: ${response.status}`);
	        }
	        return response.json();
	    })
	    .then(data => {
	        if (data.errCd === 0) {
	            errCnt = 0;
	            accessToken = data.result.accessToken;
	        } else {
	            throw new Error('Failed to get access token: ' + data.errMsg);
	        }
	    })
	    .catch(error => {
	        console.error('Error getting access token:', error);
	    });
	}	
	
	document.getElementById('send-coordinates').addEventListener('click', function() {
	    const longitude = document.getElementById('longitude').value; // 경도 값
	    const latitude = document.getElementById('latitude').value; // 위도 값
	
	    // 값이 제대로 들어갔는지 확인
	    console.log(`Received coordinates: longitude=${longitude}, latitude=${latitude}`);
	
	    if (accessToken === 'none') {
	        console.warn('Access token is not available. Requesting a new token...');
	        getAccessToken();
	    } else {
	        reverseGeo(longitude, latitude); // 함수 호출 시 좌표 전달
	    }
	});
	
	function reverseGeo(longitude, latitude) {
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
		    console.log('Full API response:', data); // 응답 데이터 전체를 출력하여 데이터 구조 확인

		    if (data.errCd === 0) {
		        // result는 배열이므로 배열의 첫 번째 요소에 접근해야 합니다.
		        if (data.result && data.result.length > 0) {
		            const firstResult = data.result[0]; // 배열의 첫 번째 요소에 접근
		            const adminDistrictCode = firstResult.adm_dr_cd;
		            const fullAddress = firstResult.full_addr;

		            console.log('Admin District Code:', adminDistrictCode);
		            console.log('Full Address:', fullAddress);
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
