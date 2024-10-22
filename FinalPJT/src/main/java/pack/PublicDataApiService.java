package pack;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

@Service
public class PublicDataApiService {

    @Value("${api.key}")
    private String apiKey;  // application.properties에서 API 키를 불러옵니다.

    private final String BASE_URL = "https://api.example.com/data";  // 사용할 API의 기본 URL

    public String getPublicData() {
        RestTemplate restTemplate = new RestTemplate();
        String url = BASE_URL + "?apikey=" + apiKey;  // API 요청 URL에 키 추가
        return restTemplate.getForObject(url, String.class);  // API 호출
    }
}
