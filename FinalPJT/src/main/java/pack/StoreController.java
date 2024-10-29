package pack;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class StoreController {
    private final ApiService apiService;

    public StoreController(ApiService apiService) {
        this.apiService = apiService;
    }

    @GetMapping("/stores")
    public String getStores(
            @RequestParam("longitude") double longitude, // 요청 파라미터로 경도를 받음
            @RequestParam("latitude") double latitude,   // 요청 파라미터로 위도를 받음
            @RequestParam("radius") int radius,          // 요청 파라미터로 반경을 받음
            @RequestParam(defaultValue = "1") int pageNo, // 요청 파라미터로 페이지 번호를 받음, 기본값은 1
            Model model) {

        List<Store> stores = apiService.getStoreData(longitude, latitude, radius, pageNo); // pageNo를 전달
        
        if (stores.isEmpty()) {
            model.addAttribute("error", "데이터를 가져오는 데 실패했습니다.");
        } else {
            model.addAttribute("stores", stores);
        }
        
        return "stores"; // Thymeleaf 템플릿 이름
    }

}
