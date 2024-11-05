import { groupBusinessesByKsicCd } from './mapping.js';
import { updateSidebar } from './api.js';

// 지도 생성
let allBusinesses = []; // 모든 비즈니스 정보를 저장할 배열

var mapContainer = document.getElementById('map'),
    mapOption = { 
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 3 
    };

var map = new kakao.maps.Map(mapContainer, mapOption);

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
   
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    var latlng = mouseEvent.latLng;
    document.getElementById('latitude').value = latlng.getLat();
    document.getElementById('longitude').value = latlng.getLng();

    // 클릭한 위치로 원의 중심을 이동하고 반경을 설정
    circle.setPosition(latlng);
    circle.setRadius(parseInt(document.getElementById('radius').value) || 0);
});
	
document.getElementById('send-coordinates').addEventListener('click', function() {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const radius = document.getElementById('radius').value;

    // 범위 체크
    if (radius < 0 || radius > 2000) {
        alert('반경 값은 0에서 2000 사이여야 합니다.');
        return;
    }

    const serviceKey = "%2FleCaqoLYYVmeyAYkuNsvs1fQEtCoHSfMZcTebr%2BoeVEfbrdqhUUTM4oEUKfwpX3r%2BhpC%2BXFc7hsktUcHW1OAg%3D%3D"; // 서비스 키를 입력하세요
    const numOfRows = 10; // 페이지당 항목 수
    let pageNo = 1; // 초기 페이지 설정
    let allBusinesses = []; // 모든 비즈니스 정보를 저장할 배열

    function fetchAllData() {
        const totalPages = 5; // 최대 페이지 수 (적절히 설정)
        const promises = [];

        for (let i = 1; i <= totalPages; i++) {
            const url = `https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRadius?serviceKey=${serviceKey}&pageNo=${i}&numOfRows=${numOfRows}&radius=${radius}&cx=${longitude}&cy=${latitude}&type=json`;
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

    fetchAllData(); // 데이터 가져오기 시작
});

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
            <div style="padding:5px; width:150px;">
                <h4>업체 목록 (${page}/${totalPages})</h4>
                ${currentItems.map(b => `<p>${b.bizesNm}</p>`).join('')}
                ${currentItems.map(b => `<p>${b.ksicNm}</p>`).join('')}
                ${currentItems.map(b => `<p>${b.lnoAdr}</p>`).join('')}
                ${currentItems.map(b => `<p>${b.rdnmAdr}</p>`).join('')}
                <div>
                    ${page > 1 ? `<button id="prevBtn" style="margin-right: 5px;"> < </button>` : ''}
                    ${page < totalPages ? `<button id="nextBtn" style="margin-left: 5px; margin-right: 5px;"> > </button>` : ''}
                    <button id="closeBtn" style="margin-left: 5px;">닫기</button> <!-- 종료 버튼 추가 -->
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
