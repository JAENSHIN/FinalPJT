import { updateSidebar} from '../core/biz_api.js';
import { reverseGeo } from '../features/reverseGeo.js';


// 지도 생성
let allBusinesses = []; // 모든 비즈니스 정보를 저장할 배열

var mapContainer = document.getElementById('map'),
    mapOption = { 
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 3 
    };

export var map = new kakao.maps.Map(mapContainer, mapOption);

var circle = new kakao.maps.Circle({
    center: new kakao.maps.LatLng(37.5665, 126.9780),
    radius: 0,
    strokeColor: '#75B8FA',
    strokeOpacity: 0.8,
    strokeStyle: 'solid',
    fillColor: '#CFE7FF',
    fillOpacity: 0.5
});
    
circle.setMap(map);

let markers = []; // 마커를 저장할 배열
const markerClusterer = new kakao.maps.MarkerClusterer({
    map: map,
    averageCenter: true,
    minLevel: 10 // 클러스터링 시작 레벨
});
   


// 클릭 이벤트 수정
// 지도 클릭 이벤트
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    var latlng = mouseEvent.latLng;
	const latitude = latlng.getLat(); // 위도
	const longitude = latlng.getLng(); // 경도
    const radius = 100; // 반경 값을 고정 (100m)

    // 클릭한 좌표에 반경 설정
    circle.setPosition(latlng);
    circle.setRadius(radius);

    // 상권 데이터와 인구 데이터를 가져옵니다.
    fetchAllData(latlng.getLat(), latlng.getLng(), radius);
	reverseGeo(latlng.getLng(), latlng.getLat());
	
	fetch(`http://localhost:3000/api/recommendation?latitude=${latitude}&longitude=${longitude}`)
	      .then(response => response.json())
	      .then(data => {
	          updateAIRecommendations(data.recommendation);
	      })
	      .catch(error => {
	          console.error('추천 오류:', error);
	      });

  
});
// fetchAllData 함수 - 상권 정보를 가져오는 기존 함수
function fetchAllData(latitude, longitude, radius) {
    const numOfRows = 10;
    const totalPages = 5;
    const promises = [];

    for (let i = 1; i <= totalPages; i++) {
        const url = `http://localhost:3000/api/storeListInRadius?latitude=${latitude}&longitude=${longitude}&radius=${radius}&pageNo=${i}`;
        promises.push(fetch(url).then(response => response.json()));
    } 

    Promise.all(promises)
        .then(responses => {
            const allBusinesses = responses.flatMap(response => response.body.items || []);
            updateSidebar({ body: { items: allBusinesses } });
            displayMarkers({ body: { items: allBusinesses } });
        })
        .catch(error => {
            console.error('오류 발생:', error);
        });
}
//AI 추천 기
function updateAIRecommendations(recommendation) {
    const aiIdeaList = document.getElementById("aiIdeaList");
    aiIdeaList.innerHTML = ''; // 기존 추천 목록 초기화

    // 각 추천 항목을 줄바꿈 기준으로 나눕니다.
    const recommendations = recommendation.split(/\d+\.\s+/).filter(rec => rec.trim() !== ''); // 숫자. 을 기준으로 나누어 추천 항목 분리

    recommendations.forEach((rec, index) => {
        const [item, reason] = rec.split('이유:').map(part => part.trim()); // 추천 아이템과 이유를 분리

        const listItem = document.createElement('div'); // 추천 항목을 위한 div 생성
        listItem.className = 'ai-recommendation-item';

        // 추천 아이템 부분
        const itemElement = document.createElement('strong');
        itemElement.className = 'recommendation-item';
        itemElement.textContent = `${index + 1}순위: ${item}`;

        // 추천 이유 부분
        const reasonElement = document.createElement('div');
        reasonElement.className = 'recommendation-reason';
        reasonElement.textContent = `${reason}`;

        // listItem에 추가
        listItem.appendChild(itemElement);
        listItem.appendChild(document.createElement('br')); // 줄바꿈
        listItem.appendChild(reasonElement);

        aiIdeaList.appendChild(listItem);
    });
}

// InfoWindow 생성
const infowindow = new kakao.maps.InfoWindow({
    zIndex: 1 // 정보창의 z-index 설정
});

// InfoWindow 표시 함수
function displayInfoWindow(marker, businesses) {
    const itemsPerPage = 1; // 한 페이지에 표시할 업체 수
    let currentPage = 1; // 현재 페이지
    const totalPages = Math.ceil(businesses.length / itemsPerPage); // 총 페이지 수

    function renderPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const currentItems = businesses.slice(start, end);

		const content = `
		    <div class="info-window">
		        <h4 class="info-window-title">업체 목록 (${page}/${totalPages})</h4>
		        ${currentItems.map(b => `<p class="info-window-item">${b.bizesNm}</p>`).join('')}
		        ${currentItems.map(b => `<p class="info-window-item">${b.ksicNm}</p>`).join('')}
		        ${currentItems.map(b => `<p class="info-window-item">${b.rdnmAdr}</p>`).join('')}
		        <div class="info-window-buttons">
		            <button class="info-window-btn close-btn" id="closeBtn">닫기</button>
		            <div class="nav-buttons">
		                ${page > 1 ? `<button class="info-window-btn" id="prevBtn">이전</button>` : ''}
		                ${page < totalPages ? `<button class="info-window-btn" id="nextBtn">다음</button>` : ''}
		            </div>
		        </div>
		    </div>
		`;

        infowindow.setContent(content);
        infowindow.setPosition(marker.getPosition()); // 마커 위치에 정보창 표시
        infowindow.open(map, marker); // 맵과 마커를 연결하여 정보창 오픈

        // 버튼 클릭 이벤트 리스너 추가
        if (page > 1) {
            document.getElementById('prevBtn').addEventListener('click', function() {
                currentPage--;
                renderPage(currentPage);
            });
        }
        if (page < totalPages) {
            document.getElementById('nextBtn').addEventListener('click', function() {
                currentPage++;
                renderPage(currentPage);
            });
        }

        // 종료 버튼 클릭 이벤트
        document.getElementById('closeBtn').addEventListener('click', function() {
            infowindow.close(); // 정보창 닫기
        });
    }

    renderPage(currentPage); // 초기 페이지 렌더링
}

// 마커 생성 및 클릭 이벤트 설정
function displayMarkers(data) {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    markerClusterer.clear();

    const circleCenter = circle.getPosition();
    const radius = circle.getRadius();

    if (data && Array.isArray(data.body.items)) {
        const groupedBusinesses = {};

        // 비즈니스 정보를 그룹화
        data.body.items.forEach(business => {
            const position = new kakao.maps.LatLng(business.lat, business.lon);
            const key = `${business.lat},${business.lon}`;

            if (!groupedBusinesses[key]) {
                groupedBusinesses[key] = [];
            }
            groupedBusinesses[key].push(business);

            const marker = new kakao.maps.Marker({
                position: position
            });
            markers.push(marker);
            markerClusterer.addMarker(marker);

            // 마커 클릭 이벤트 추가
            kakao.maps.event.addListener(marker, 'click', function() {
                displayInfoWindow(marker, groupedBusinesses[key]); // 클릭 시 정보창 표시
            });
        });
    }
}