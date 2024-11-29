document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.toggle-select-btn');
    const selectOptions = document.querySelector('.select-options');

    toggleBtn.addEventListener('click', () => {
        // 날짜 설정 부분의 display 속성을 토글
        if (selectOptions.style.display === 'none' || selectOptions.style.display === '') {
            selectOptions.style.display = 'block';
        } else {
            selectOptions.style.display = 'none';
        }
    });
});
