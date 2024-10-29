package pack;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import java.util.List;

public class DataProcessor implements ItemProcessor<OutputType, Store> {

    @Override
    public Store process(OutputType item) throws Exception {
        Store store = new Store();
        store.setBusinessName(item.getLocationName()); // 위치 이름
        store.setLatitude(Double.parseDouble(item.getLatitude())); // 위도
        store.setLongitude(Double.parseDouble(item.getLongitude())); // 경도
        store.setLnoAddress(item.getLnoAddress()); // 지번 주소
        store.setRdnmAddress(item.getRdnmAddress()); // 도로명 주소
        store.setKsicName(item.getKsicName()); // KSIC 이름

        return store;
    }
    
    @Value("${api.url}")
    private String apiUrl;

    @Value("${api.key}")
    private String apiKey;

    // OutputType을 가져오기 위한 메서드
    private List<OutputType> fetchDataFromApi(InputType input) {
        RestTemplate restTemplate = new RestTemplate();
        
        

        // API 요청 URL (여기서 YOUR_API_URL은 실제 API URL로 교체해야 합니다)
        String url = String.format("%s?serviceKey=%s&pageNo=%s&numOfRows=%s&radius=%s&cx=%s&cy=%s&type=%s",
        		apiUrl,
        		input.getServiceKey(),
                input.getPageNo(),
                input.getNumOfRows(),
                input.getRadius(),
                input.getCx(),
                input.getCy(),
                input.getType());

        try {
            // API 호출
            ResponseEntity<ResponseType> responseEntity = restTemplate.getForEntity(url, ResponseType.class);
            ResponseType response = responseEntity.getBody();
            
            // API 호출 결과에서 OutputType 리스트 반환
            return response != null ? response.getData() : List.of(); // 빈 리스트 반환

        } catch (HttpClientErrorException e) {
            // 오류 처리: API 호출 실패 시 로그 남기기
            System.err.println("API 호출 실패: " + e.getMessage());
            return List.of(); // 빈 리스트 반환
        }
    }
}
