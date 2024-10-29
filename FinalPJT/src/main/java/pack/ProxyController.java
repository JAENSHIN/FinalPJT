package pack;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProxyController {
    private final ApiService apiService;

    public ProxyController(ApiService apiService) {
        this.apiService = apiService;
    }

    @GetMapping("/proxy/fetchData")
    public String fetchData(@RequestParam String cx, @RequestParam String cy, @RequestParam(defaultValue = "1") int pageNo) {
        return apiService.fetchData(cx, cy, pageNo);
    }

}
