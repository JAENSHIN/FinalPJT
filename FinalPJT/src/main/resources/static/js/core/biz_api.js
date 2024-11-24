import { createChart,groupByIndustry, prepareChartData } from '../ui/bizChart.js';

export function updateSidebar(data) {
    if (data && Array.isArray(data.body.items)) {
        const industryGrouped = groupByIndustry(data.body.items);


		// 일반 업종 그룹 상위 6개 + 기타
		        const ksicChartData = prepareChartData(industryGrouped.기업);
		        createChart(
		            'ksicChart',
		            ksicChartData.labels,
		            ksicChartData.data,
		            '기업 상위 6개',
		            ksicChartData.others
		        );
		// 일반 업종 그룹 상위 6개 + 기타
		        const industryChartData = prepareChartData(industryGrouped.일반업종);
		        createChart(
		            'industryChart',
		            industryChartData.labels,
		            industryChartData.data,
		            '일반 업종 상위 6개',
		            industryChartData.others
		        );
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
