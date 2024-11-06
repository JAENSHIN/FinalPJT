// addressSearch.js
import { map } from './map.js'; // map 객체를 가져옴

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const handle = document.getElementById('sidebar-handle');
    let isSidebarVisible = false;

    // 핸들을 클릭해서 사이드바를 올리거나 내리기
    handle.addEventListener('click', function() {
        if (isSidebarVisible) {
            sidebar.style.transform = 'translateY(100%)'; // 사이드바 숨기기
        } else {
            sidebar.style.transform = 'translateY(0)'; // 사이드바 올리기
        }
        isSidebarVisible = !isSidebarVisible;
    });

    // 웹 페이지에서 지도를 고정하고, 사이드바만 스크롤 가능하도록 설정
    document.body.style.overflow = 'auto'; // 본문 스크롤 가능
    const content = document.getElementById('content');
    content.style.overflow = 'hidden'; // #content 영역은 스크롤 고정
    sidebar.style.overflowY = 'auto'; // 사이드바 스크롤 가능

    const places = new kakao.maps.services.Places(); // 장소 검색 객체 생성

    document.getElementById('searchButton').addEventListener('click', function() {
        const keyword = document.getElementById('address').value;
        if (!keyword) {
            alert('검색어를 입력하세요.');
            return;
        }

        // 장소 검색 요청
        places.keywordSearch(keyword, function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                displaySearchResults(result);
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                alert('검색 결과가 없습니다.');
            } else {
                alert('검색 중 오류가 발생했습니다.');
            }
        });
    });

    function displaySearchResults(results) {
        const resultList = document.getElementById('searchResults');
        resultList.innerHTML = ''; // 기존 결과 초기화

        results.forEach((place, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${place.place_name} (${place.address_name})`;
            listItem.className = 'search-result-item';
            listItem.addEventListener('click', function() {
                const coords = new kakao.maps.LatLng(place.y, place.x);
                map.setCenter(coords);
                map.setLevel(3);

                // 마커 추가
                const marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });

                // 정보창 추가
                const infowindow = new kakao.maps.InfoWindow({
                    content: `<div style="padding:5px;">${place.place_name}</div>`
                });
                infowindow.open(map, marker);
            });
            resultList.appendChild(listItem);
        });
    }
});
