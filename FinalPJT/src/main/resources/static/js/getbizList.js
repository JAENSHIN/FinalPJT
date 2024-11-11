	// API 기본 정보
	const serviceKey = '%2FleCaqoLYYVmeyAYkuNsvs1fQEtCoHSfMZcTebr%2BoeVEfbrdqhUUTM4oEUKfwpX3r%2BhpC%2BXFc7hsktUcHW1OAg%3D%3D';  // 공공데이터포털에서 발급받은 인증키
	const numOfRows = 5;  // 한 페이지에 보여줄 데이터 개수
	let pageNo = 1;  // 현재 페이지 번호
	let totalPages = 1;  // 전체 페이지 수
	
	// 데이터를 가져와 화면에 표시하는 함수
	async function fetchData() {
	  const url = `https://apis.data.go.kr/1421000/mssBizService_v2/getbizList_v2?serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}`;
	  const response = await fetch(url);
	  const data = await response.text();
	  
	  const parser = new DOMParser();
	  const xmlDoc = parser.parseFromString(data, "application/xml");
	
	  // 첫 페이지 요청 시 총 페이지 수를 설정
	  if (pageNo === 1) {
	    const totalCount = parseInt(xmlDoc.getElementsByTagName("totalCount")[0].textContent, 10);
	    totalPages = Math.ceil(totalCount / numOfRows);
	  }
	
	  // 데이터를 HTML에 추가
	  const contentDiv = document.querySelector('.content');
	  contentDiv.innerHTML = '';  // 이전 데이터를 지움
	
	  const items = xmlDoc.getElementsByTagName("item");
	  for (let i = 0; i < items.length; i++) {
	    const item = items[i];
	    const itemHtml = `
	      <div class="item">
	        <h3>${item.getElementsByTagName("title")[0]?.textContent || "제목 없음"}</h3>
	        <p>${item.getElementsByTagName("dataContents")[0]?.textContent || "내용 없음"}</p>
			<p><strong>작성자:</strong> ${item.getElementsByTagName("writerName")[0]?.textContent || "정보 없음"}</p>
			<p>${item.getElementsByTagName("writerPosition")[0]?.textContent || "내용 없음"}</p>
			<p><strong>연락처:</strong> ${item.getElementsByTagName("writerPhone")[0]?.textContent || "정보 없음"}</p>
			<p>${item.getElementsByTagName("writerEmail")[0]?.textContent || "내용 없음"}</p>
			<p>${item.getElementsByTagName("viewUrl")[0]?.textContent || "내용 없음"}</p>
			
			</div>
	      <hr>
	    `;
	    contentDiv.innerHTML += itemHtml;
	  }
	
	  // 페이지 번호 업데이트
	  document.getElementById('pageNumber').textContent = pageNo;
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
