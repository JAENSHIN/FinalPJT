let populationChart = null; // 연령대별 인구 차트를 저장하는 변수
let genderChart = null; // 성별 비율 차트를 저장하는 변수

// 수정된 createPopulationChart
export function createPopulationChart(data) {
    if (populationChart) {
        populationChart.destroy(); // 기존 차트 제거
    }

    const ageChartCtx = document.getElementById("populationchart").getContext("2d");
    populationChart = new Chart(ageChartCtx, { // 새로운 차트 생성
        type: "bar",
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: "인구수",
                data: Object.values(data),
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// 수정된 createGenderChart
export function createGenderChart(data) {
    if (genderChart) {
        genderChart.destroy(); // 기존 차트 제거
    }

    const male = parseInt(data.male, 10);
    const female = parseInt(data.female, 10);
    const total = male + female;

    if (total === 0) {
        console.warn("총 인구가 0입니다. 데이터를 확인하세요.");
        return;
    }

    const malePercentage = ((male / total) * 100).toFixed(1);
    const femalePercentage = ((female / total) * 100).toFixed(1);

    const genderChartCtx = document.getElementById("genderChart").getContext("2d");
    genderChart = new Chart(genderChartCtx, { // 새로운 차트 생성
        type: "pie",
        data: {
            labels: [
                `남성 (${malePercentage}%)`,
                `여성 (${femalePercentage}%)`
            ],
            datasets: [{
                label: "성별 비율",
                data: [male, female],
                backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
                borderWidth: 1
            }]
        },
        options: {
			plugins: {
			                tooltip: {
			                    callbacks: {
			                        label: (context) => {
			                            const value = context.raw;
			                            const percentage = ((value / total) * 100).toFixed(1);
			                            return `${context.label}: ${value}명 (${percentage}%)`;
			                        }
			                    }
			                },
			                datalabels: {
			                    formatter: (value, context) => {
			                        const percentage = ((value / total) * 100).toFixed(1);
			                        return `${percentage}%`;
			                    },
			                    color: '#000',
			                    font: {
			                        weight: 'bold'
			                    }
			                }
			            }
			        },
			        plugins: [ChartDataLabels] // Chart.js 플러그인 추가
    });
}