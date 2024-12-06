package pack;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class mainController {

    // 메인 페이지 매핑
	// 루트 경로 요청 처리 추가
	@GetMapping("/")
	public String home() {
	    return "redirect:/main"; // /main으로 리디렉션
	}

	// 기존 매핑 유지
	@GetMapping("/main")
	public String main() {
	    return "main"; // templates/main.html 반환
	}


    // 지도 페이지 매핑
    @GetMapping("/map")
    public String map() {
        return "map"; // templates/map.html 반환
    }
 // 공 페이지 매핑
    @GetMapping("/inform")
    public String inform() {
        return "inform"; // templates/inform.html 반환
    }
}
