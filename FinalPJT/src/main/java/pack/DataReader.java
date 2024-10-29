package pack;

import org.springframework.batch.item.ItemReader;
import org.springframework.web.client.RestTemplate;
import java.util.Iterator;
import java.util.List;

public class DataReader implements ItemReader<OutputType> {
    private RestTemplate restTemplate = new RestTemplate();
    private String apiUrl = "http://apis.data.go.kr/B553077/api/open/sdsc2/storeListInArea";
    private int currentPage = 1;
    private int pageSize = 100; // 페이지 크기 설정
    private Iterator<OutputType> dataIterator;
    private InputType inputType; // InputType 객체 추가

    public DataReader(InputType inputType) {
        this.inputType = inputType; // 생성자에서 InputType을 초기화
    }

    @Override
    public OutputType read() throws Exception {
        if (dataIterator == null || !dataIterator.hasNext()) {
            List<OutputType> outputList = fetchDataFromApi(currentPage, pageSize);
            if (outputList != null && !outputList.isEmpty()) {
                dataIterator = outputList.iterator();
                currentPage++; // 다음 페이지로 이동
            } else {
                return null; // 더 이상 데이터가 없으면 null 반환
            }
        }
        return dataIterator.hasNext() ? dataIterator.next() : null; // 다음 데이터 반환
    }

    private List<OutputType> fetchDataFromApi(int page, int size) {
        String url = apiUrl + "?serviceKey=" + inputType.getServiceKey() + 
                     "&pageNo=" + page + "&numOfRows=" + size + 
                     "&radius=" + inputType.getRadius() + 
                     "&cx=" + inputType.getCx() + 
                     "&cy=" + inputType.getCy() + 
                     "&type=" + inputType.getType();
        
        try {
            ResponseType response = restTemplate.getForObject(url, ResponseType.class);
            // API 응답을 처리하고 OutputType 목록 반환
            return response != null && response.getData() != null ? response.getData() : List.of(); 
        } catch (Exception e) {
            // API 호출 중 오류가 발생할 경우 예외 처리
            e.printStackTrace();
            return List.of(); // 오류 발생 시 빈 리스트 반환
        }
    }
}
