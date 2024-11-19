import { ksicCodeMapping,classifyKsic } from '/js/mapping.js'; // 중복 제거 후 유지

let ksicChart;
let industryChart;

export function updateSidebar(data) {
    if (data && Array.isArray(data.body.items)) {
        const industryGrouped = groupByIndustry(data.body.items);

        // 기업 그룹 상위 6개
        const ksicChartData = prepareChartData(industryGrouped.기업);
        createChart('ksicChart', ksicChartData.labels, ksicChartData.data, '기업 그룹 상위 6개');

        // 일반 업종 그룹 상위 6개
        const industryChartData = prepareChartData(industryGrouped.일반업종);
        createChart('industryChart', industryChartData.labels, industryChartData.data, '일반 업종 상위 6개');
    }
}

function groupByIndustry(businesses) {
    const grouped = {
        기업: {},
        일반업종: {}
    };

    businesses.forEach(business => {
        const category = classifyKsic(business.ksicCd); // KSIC 코드를 그룹명으로 변환
        console.log(`Business: ${business.bizesNm}, KSIC: ${business.ksicCd}, Category: ${category}`);
        
        if (category === '기업') {
            const mappedName = getMappedName(business.ksicCd);
            if (!grouped.기업[mappedName]) {
                grouped.기업[mappedName] = 0;
            }
            grouped.기업[mappedName]++;
        } else {
            const mappedName = getMappedName(business.ksicCd);
            if (!grouped.일반업종[mappedName]) {
                grouped.일반업종[mappedName] = 0;
            }
            grouped.일반업종[mappedName]++;
        }
    });

    return grouped;
}

// KSIC 코드를 mapping.js에서 제공한 이름으로 변환하는 함수
function getMappedName(ksicCd) {
    for (const [name, codes] of Object.entries(ksicCodeMapping)) {
        if (codes.includes(ksicCd)) {
            return name;
        }
    }
    return '기타'; // 매핑되지 않은 경우
}

function prepareChartData(groupedData) {
    const result = {
        labels: [],
        data: []
    };

    // 그룹 데이터가 없는 경우 차트를 그리지 않도록 처리
    if (Object.keys(groupedData).length === 0) {
        console.warn('No data available for this group');
        return result;  // 빈 데이터 반환
    }

    // 상위 6개 그룹 선택
    const sortedEntries = Object.entries(groupedData)
        .sort((a, b) => b[1] - a[1])  // 그룹 내에서 개수가 많은 순으로 정렬
        .slice(0, 6); // 상위 6개 선택

    sortedEntries.forEach(([key, value]) => {
        result.labels.push(key);  // mapping.js에서 지정한 이름을 라벨로 사용
        result.data.push(value);
    });

    return result;
}
function createChart(chartId, labels, data, title) {
    console.log(`Creating chart for ${title}`);
    console.log('Labels:', labels);
    console.log('Data:', data);

    if (data.length === 0) {
        console.warn('No data to display on the chart:', title);
        return;  // 데이터가 없으면 차트를 그리지 않음
    }

    const ctx = document.getElementById(chartId).getContext('2d');
    
    // 기업 차트와 일반 업종 차트를 각각 관리
    if (chartId === 'ksicChart') {
        if (ksicChart) ksicChart.destroy();
        ksicChart = new Chart(ctx, 		{
		       type: 'bar',
		       data: {
		           labels: labels,
		           datasets: [{
		               label: title,
		               data: data,
		               backgroundColor: 'rgba(75, 192, 192, 0.2)',
		               borderColor: 'rgba(75, 192, 192, 1)',
		               borderWidth: 1
		           }]
		       },
		       options: {
		           scales: {
		               y: {
		                   beginAtZero: true
		               }
		           }
		       }
		   });
    } else if (chartId === 'industryChart') {
        if (industryChart) industryChart.destroy();
        industryChart = new Chart(ctx, 		{
		       type: 'bar',
		       data: {
		           labels: labels,
		           datasets: [{
		               label: title,
		               data: data,
		               backgroundColor: 'rgba(75, 192, 192, 0.2)',
		               borderColor: 'rgba(75, 192, 192, 1)',
		               borderWidth: 1
		           }]
		       },
		       options: {
		           scales: {
		               y: {
		                   beginAtZero: true
		               }
		           }
		       }
		   });
}
}
// 버튼과 섹션 DOM 요소 가져오기
const businessInfoBtn = document.getElementById("business-info-btn");
const populationInfoBtn = document.getElementById("population-info-btn");
const businessInfoSection = document.getElementById("business-info-section");
const populationInfoSection = document.getElementById("population-info-section");

// 버튼 클릭 이벤트 핸들러
businessInfoBtn.addEventListener("click", () => {
    businessInfoSection.style.display = "block"; // 상권정보 섹션 보이기
    populationInfoSection.style.display = "none"; // 인구정보 섹션 숨기기
});

populationInfoBtn.addEventListener("click", () => {
    populationInfoSection.style.display = "block"; // 인구정보 섹션 보이기
    businessInfoSection.style.display = "none"; // 상권정보 섹션 숨기기
});
