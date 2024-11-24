export function displaySearchResults(results,map) {
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