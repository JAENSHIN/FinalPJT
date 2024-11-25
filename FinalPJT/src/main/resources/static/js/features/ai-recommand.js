// ai_recommand.js
export function getNearbyBusinessIdeas(latlng) {
    const apiUrl = 'https://api.clova.ai/v1/your_business_ideas_endpoint'; // 클로바 API 엔드포인트
    const apiKey = 'YOUR_API_KEY';
    const data = {
        latitude: latlng.getLat(),
        longitude: latlng.getLng(),
        radius: 1000 // 1km 반경
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        displayBusinessIdeas(result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayBusinessIdeas(ideas) {
    let ideaList = document.getElementById('aiIdeaList');
    ideaList.innerHTML = '';
    ideas.forEach(idea => {
        let listItem = document.createElement('li');
        listItem.textContent = idea;
        ideaList.appendChild(listItem);
    });
}
