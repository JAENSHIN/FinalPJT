function showSection(section) {
    const businessBtn = document.getElementById('business-info-btn');
    const populationBtn = document.getElementById('population-info-btn');
    const businessSection = document.getElementById('business-info-section');
    const populationSection = document.getElementById('population-info-section');

    if (section === 'business') {
        businessBtn.classList.add('active');
        populationBtn.classList.remove('active');
        businessSection.style.display = 'block';
        populationSection.style.display = 'none';
    } else if (section === 'population') {
        populationBtn.classList.add('active');
        businessBtn.classList.remove('active');
        populationSection.style.display = 'block';
        businessSection.style.display = 'none';
    }
}
