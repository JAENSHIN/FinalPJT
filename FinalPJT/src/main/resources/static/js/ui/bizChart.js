import { ksicCodeMapping,classifyKsic } from '../utils/mapping.js'; // 중복 제거 후 유지

let ksicChart;
let industryChart;


export function groupByIndustry(businesses) {
    const grouped = {
        기업: {},
        일반업종: {}
    };

    businesses.forEach(business => {
        const category = classifyKsic(business.ksicCd); // KSIC 코드를 그룹명으로 변환
        
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

export function prepareChartData(groupedData) {
    const result = {
        labels: [],
        data: [],
	    others: {},
    };

    // 그룹 데이터가 없는 경우 차트를 그리지 않도록 처리
    if (Object.keys(groupedData).length === 0) {
        console.warn('No data available for this group');
        return result;  // 빈 데이터 반환
    }

    // 상위 6개 그룹 선택
    const sortedEntries = Object.entries(groupedData)
        .sort((a, b) => b[1] - a[1]);  // 그룹 내에서 개수가 많은 순으로 정렬
		sortedEntries.forEach(([key, value], index) => {
		        if (index < 6) {
		            result.labels.push(key); // 상위 6개 그룹
		            result.data.push(value);
		        } else {
		            result.others[key] = value; // 기타 데이터로 저장
		        }
		    });

		    // 기타 데이터를 합산하여 추가
		    if (Object.keys(result.others).length > 0) {
		        const othersTotal = Object.values(result.others).reduce((sum, value) => sum + value, 0);
		        result.labels.push('기타');
		        result.data.push(othersTotal);
		    }
    return result;
}
export function createChart(chartId, labels, data, title, others) {
    const chartContainer = document.getElementById(chartId).parentElement; // 캔버스 부모 요소
    const canvas = document.getElementById(chartId);

    // 데이터가 없는 경우
    if (data.length === 0) {

        // 기존 차트를 제거하고, 오류 메시지 추가
        if (canvas) {
            canvas.style.display = 'none'; // 캔버스를 숨김
        }

        // 이미 오류 메시지가 존재하면 중복 생성 방지
        if (!chartContainer.querySelector('.error-message')) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
			errorMessage.innerHTML = '반경 내 상권이 없습니다.<br> 그래프를 표시할 수 없습니다.<br>인구정보는 주소기반으로 표시됩니다.';       
            chartContainer.appendChild(errorMessage);
        }

        return; // 함수 종료
    }

    // 데이터가 있는 경우
    if (canvas) {
        canvas.style.display = 'block'; // 캔버스를 다시 표시
    }
    // 기존 오류 메시지가 있으면 제거
    const existingErrorMessage = chartContainer.querySelector('.error-message');
    if (existingErrorMessage) {
        existingErrorMessage.remove();
    }

    const ctx = canvas.getContext('2d');

    // 기업 차트와 일반 업종 차트를 각각 관리
    if (chartId === 'ksicChart') {
        if (ksicChart) ksicChart.destroy();
        ksicChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    barThickness: 25, // 막대 두께
                    borderSkipped: false,
                    borderRadius: 8,
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    legend: { display: false },
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const clickedIndex = elements[0].index;
                        if (labels[clickedIndex] === '기타' && others) {
                            showOthersPopup(others);
                        }
                    }
                },
            },
        });
    } else if (chartId === 'industryChart') {
        if (industryChart) industryChart.destroy();
        industryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    barThickness: 25,
                    borderSkipped: false,
                    borderRadius: 8,
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                onClick: (_event, elements) => {
                    if (elements.length > 0) {
                        const clickedIndex = elements[0].index;
                        if (labels[clickedIndex] === '기타' && others) {
                            showOthersPopup(others);
                        }
                    }
                },
            },
        });
    }
}

function showOthersPopup(others) {
    const popupContent = Object.entries(others)
        .map(([key, value]) => `<p>${key}: ${value}건</p>`)
        .join('');
    
    const existingPopup = document.getElementById('others-popup');
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement('div');
    popup.id = 'others-popup';

    popup.innerHTML = `
        <h3>기타 항목</h3>
        ${popupContent}
        <button onclick="document.getElementById('others-popup').remove()">닫기</button>
    `;

    document.body.appendChild(popup);
}
