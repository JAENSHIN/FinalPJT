package pack;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

@Service
public class ApiService {
    private final RestTemplate restTemplate;
    private final StoreProcessor storeProcessor;
    private static final Logger LOGGER = Logger.getLogger(ApiService.class.getName());

    @Value("${api.url}")
    private String apiUrl;

    @Value("${api.key}")
    private String apiKey;

    public ApiService(RestTemplate restTemplate, StoreProcessor storeProcessor) {
        this.restTemplate = restTemplate;
        this.storeProcessor = storeProcessor;
    }
    
    public String fetchData(String cx, String cy, int pageNo) {
        String url = String.format("%s?ServiceKey=%s&cx=%s&cy=%s&pageNo=%d&numOfRows=10",
                apiUrl, apiKey, cx, cy, pageNo);
        return restTemplate.getForObject(url, String.class);
    }

    public List<Store> getStoreData(double longitude, double latitude, int radius, int pageNo) {
        // URL 형식에 맞춰 수정
        String url = String.format("%s?ServiceKey=%s&pageNo=%d&numOfRows=10&radius=%d&cx=%f&cy=%f&type=json", 
                                    apiUrl, apiKey, pageNo, radius, longitude, latitude);
        
        try {
            String jsonResponse = restTemplate.getForObject(url, String.class);
            return storeProcessor.processStoreData(jsonResponse);
        } catch (RestClientException e) {
            LOGGER.severe("API 호출 실패: " + e.getMessage());
            return Collections.emptyList();  // 실패 시 빈 리스트 반환
        }
    }
}
