// toggle-select-btn과 select-options를 조작하는 코드
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.toggle-select-btn');
    const selectOptions = document.querySelector('.select-options');

    toggleBtn.addEventListener('click', () => {
        // select-options의 display 속성을 토글
        if (selectOptions.style.display === 'none' || selectOptions.style.display === '') {
            selectOptions.style.display = 'block';
        } else {
            selectOptions.style.display = 'none';
        }
    });
});
