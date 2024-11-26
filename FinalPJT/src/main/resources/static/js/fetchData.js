document.addEventListener('DOMContentLoaded', () => {
    // 초기 데이터 로드
    fetchData();
});

// API 기본 정보
const numOfRows = 8; // 한 페이지에 보여줄 데이터 개수
let pageNo = 1; // 현재 페이지 번호
let totalPages = 1; // 전체 페이지 수

// 데이터를 가져와 화면에 표시하는 함수
async function fetchData() {
    const loadingDiv = document.querySelector('.loading');
    const contentDiv = document.querySelector('.program-list');
    const pageInfo = document.querySelector('.page-info');
    loadingDiv.style.display = 'block';
    contentDiv.innerHTML = ''; // 이전 데이터를 지움

    try {
        let allItems = [];
        let page = 1;

        // 전체 페이지 데이터 가져오기
        while (true) {
            const response = await fetch(`http://localhost:3000/api/getData?page=${page}&numOfRows=100`);
            if (!response.ok) {
                console.error('응답 상태 코드:', response.status);
                throw new Error('네트워크 응답이 올바르지 않습니다.');
            }

            const data = await response.json();
            allItems = allItems.concat(data.items);

            // 마지막 페이지에 도달한 경우 중단
            if (page >= data.totalPages) {
                break;
            }

            page++;
        }

        // 사용자 입력 검색어 가져오기
        const keywordInput = document.querySelector('#search-keyword');
        const keyword = keywordInput && keywordInput.value ? keywordInput.value.toLowerCase() : "";

        // 검색어에 따라 필터링된 데이터
        let filteredItems = allItems;
        if (keyword) {
            filteredItems = allItems.filter(item => item.title && item.title.toLowerCase().includes(keyword));
        }

        // 페이징 처리를 위해 현재 페이지 계산
        const startIdx = (pageNo - 1) * numOfRows;
        const endIdx = startIdx + numOfRows;
        const pagedItems = filteredItems.slice(startIdx, endIdx);
        totalPages = Math.ceil(filteredItems.length / numOfRows);

        // DocumentFragment 사용하여 필터링된 데이터 표시
        const fragment = document.createDocumentFragment();
        pagedItems.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('program-item');
            li.innerHTML = `
                <a href="${item.viewUrl}" target="_blank">
                    <span class="tag">중소벤처기업부</span>
                    <h3>${item.title || "제목 없음"}</h3>
                    <p>${item.writerPosition || "정보 없음"} | 
                    ${formatDate(item.applicationStartDate)} ~ ${formatDate(item.applicationEndDate)}</p>
                </a>
            `;
            fragment.appendChild(li);
        });

        contentDiv.appendChild(fragment);

        // 페이지 정보 업데이트
        pageInfo.textContent = `페이지 ${pageNo} / ${totalPages}`;
    } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
        contentDiv.innerHTML = '<li>데이터를 불러오는 데 오류가 발생했습니다.</li>';
    } finally {
        loadingDiv.style.display = 'none';
    }

    // 페이지 버튼 상태 업데이트
    updatePageButtons();
}

// 날짜 필터링을 위해 호출되는 함수
function filterByDate() {
    pageNo = 1; // 페이지를 처음으로 리셋
    fetchData();
}

// 키워드 필터링을 위해 호출되는 함수
function filterByKeyword() {
    pageNo = 1; // 페이지를 처음으로 리셋
    fetchData();
}

// 페이지 넘김 함수 및 버튼 상태 업데이트
function nextPage() {
    if (pageNo < totalPages) {
        pageNo++;
        fetchData();
    }
}

function prevPage() {
    if (pageNo > 1) {
        pageNo--;
        fetchData();
    }
}

function updatePageButtons() {
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    // 이전 버튼 상태 업데이트
    if (pageNo <= 1) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    // 다음 버튼 상태 업데이트
    if (pageNo >= totalPages) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

// 날짜를 'YYYY-MM-DD' 형식으로 변환하는 함수
function formatDate(dateString) {
    if (!dateString) return ""; // dateString이 없으면 빈 문자열 반환
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // 'T'를 기준으로 나누고 첫 번째 부분 반환
}
