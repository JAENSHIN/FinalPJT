package pack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import pack.PublicDataApiService;

@RestController
public class PublicDataController {

    @Autowired
    private PublicDataApiService publicDataApiService;

    @GetMapping("/public-data")
    public String getPublicData() {
        return publicDataApiService.getPublicData();  // API 호출 및 결과 반환
    }
}
