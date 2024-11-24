// addressSearch.js
import { map } from '../core/map.js'; // map 객체를 가져옴
import { displaySearchResults } from '../ui/addressSearchUI.js';


document.addEventListener('DOMContentLoaded', function() {
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
                displaySearchResults(result, map);
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                alert('검색 결과가 없습니다.');
            } else {
                alert('검색 중 오류가 발생했습니다.');
            }
        });
    });
});
