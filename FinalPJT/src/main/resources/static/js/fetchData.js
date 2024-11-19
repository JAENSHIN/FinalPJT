
// API 기본 정보
const numOfRows = 5; // 한 페이지에 보여줄 데이터 개수
let pageNo = 1; // 현재 페이지 번호
let totalPages = 1; // 전체 페이지 수

// 데이터를 가져와 화면에 표시하는 함수
async function fetchData() {
    const url = `http://localhost:3000/api/getData?page=${pageNo}&numOfRows=${numOfRows}`;
    const loadingDiv = document.querySelector('.loading');
    const contentDiv = document.querySelector('.program-list');
    loadingDiv.style.display = 'block';
    contentDiv.innerHTML = ''; // 이전 데이터를 지움

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('네트워크 응답이 올바르지 않습니다.');
        }
        const data = await response.json();

        totalPages = data.totalPages;

        data.items.forEach(item => {
            const itemHtml = `
                <li class="program-item">
                    <span class="tag">사업화</span>
                    <h3>${item.title || "제목 없음"}</h3>
                    <p>${item.dataContents || "내용 없음"} | ${item.writerName || "정보 없음"} | 
                       ${item.applicationStartDate || ""} ~ ${item.applicationEndDate || ""}</p>
                </li>
            `;
            contentDiv.innerHTML += itemHtml;
        });
    } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
        contentDiv.innerHTML = '<li>데이터를 불러오는 데 오류가 발생했습니다.</li>';
    } finally {
        loadingDiv.style.display = 'none';
    }
}

// 페이지 넘김 함수
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

// 초기 데이터 로드
fetchData();
