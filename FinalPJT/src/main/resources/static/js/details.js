document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const programId = urlParams.get('id'); // URL에서 id를 가져옴

    if (!programId) {
        alert('프로그램 ID가 제공되지 않았습니다.');
        window.location.href = 'inform.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/getProgram?id=${programId}`);
        if (!response.ok) {
            throw new Error('네트워크 응답이 올바르지 않습니다.');
        }
        const data = await response.json();

        document.getElementById('program-title').innerText = data.title || '제목 없음';
        document.getElementById('program-description').innerText = data.dataContents || '설명 없음';
        document.getElementById('program-period').innerText = `${data.applicationStartDate} ~ ${data.applicationEndDate}`;
    } catch (error) {
        console.error('프로그램 데이터를 가져오는 중 오류가 발생했습니다:', error);
        alert('프로그램 정보를 로드하는 데 실패했습니다.');
    }
});
