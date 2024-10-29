package pack;

import java.util.List;

public class StoreResponse {
    private Header header; // API 응답의 헤더
    private Body body;     // API 응답의 바디

    // 기본 생성자
    public StoreResponse() {}

    // Getters and Setters
    // ...

    @Override
    public String toString() {
        return "StoreResponse{" +
                "header=" + header +
                ", body=" + body +
                '}';
    }

    public static class Header {
        private String description;
        private List<String> columns;
        private String stdrYm;
        private String resultCode;
        private String resultMsg;

        // 기본 생성자
        public Header() {
            this.resultCode = "00";
            this.resultMsg = "NORMAL SERVICE";
        }

        // Getters and Setters
        // ...

        @Override
        public String toString() {
            return "Header{" +
                    "description='" + description + '\'' +
                    ", columns=" + columns +
                    ", stdrYm='" + stdrYm + '\'' +
                    ", resultCode='" + resultCode + '\'' +
                    ", resultMsg='" + resultMsg + '\'' +
                    '}';
        }
    }

    public static class Body {
        private List<Store> items; // 상점 리스트

        // 기본 생성자
        public Body() {}

        // Getters and Setters
        // ...

        @Override
        public String toString() {
            return "Body{" +
                    "items=" + items +
                    '}';
        }
    }
}
