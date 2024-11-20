let populationChart = null; // 연령대별 인구 차트를 저장하는 변수
let genderChart = null; // 성별 비율 차트를 저장하는 변수

export function createPopulationChart(data) {
	if (populationChart) {
	      populationChart.destroy();
	  }

    const ageChartCtx = document.getElementById("populationchart").getContext("2d");
    new Chart(ageChartCtx, {
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
export function createGenderChart(data) {
	// 기존 차트를 제거
	   if (genderChart) {
	       genderChart.destroy();
	   }
    // 데이터를 숫자로 변환
    const male = parseInt(data.male, 10);
    const female = parseInt(data.female, 10);

    const total = male + female;

    // 총 인구를 콘솔에 출력
    //console.log("총 인구:", total);

    // 총 인구가 0이면 그래프를 그리지 않고 경고 메시지를 출력
    if (total === 0) {
        console.warn("총 인구가 0입니다. 데이터를 확인하세요.");
        return;
    }

    const malePercentage = ((male / total) * 100).toFixed(1);
    const femalePercentage = ((female / total) * 100).toFixed(1);

    const genderChartCtx = document.getElementById("genderChart").getContext("2d");
    new Chart(genderChartCtx, {
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
