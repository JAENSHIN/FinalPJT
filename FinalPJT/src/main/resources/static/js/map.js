// map.js
import { groupBusinessesByKsicCd } from './mapping.js';
import { updateSidebar } from './api.js';

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
    radius: 500, // 기본 반경을 500m로 설정
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

// 지도 클릭 이벤트 리스너
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    var latlng = mouseEvent.latLng;
    document.getElementById('latitude').value = latlng.getLat();
    document.getElementById('longitude').value = latlng.getLng();

    // 클릭한 위치로 원의 중심을 이동하고 반경을 설정
    circle.setPosition(latlng);
    circle.setRadius(500); // 반경을 500m로 설정

    // 데이터를 자동으로 가져오기
    fetchAllData(latlng.getLat(), latlng.getLng(), 500);
});

function fetchAllData(latitude, longitude, radius) {
    const serviceKey = "%2FleCaqoLYYVmeyAYkuNsvs1fQEtCoHSfMZcTebr%2BoeVEfbrdqhUUTM4oEUKfwpX3r%2BhpC%2BXFc7hsktUcHW1OAg%3D%3D"; // 서비스 키를 입력하세요
    const numOfRows = 10; // 페이지당 항목 수
    let pageNo = 1; // 초기 페이지 설정
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

// 마커 생성 및 클릭 이벤트 설정
function displayMarkers(data) {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    markerClusterer.clear();

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
