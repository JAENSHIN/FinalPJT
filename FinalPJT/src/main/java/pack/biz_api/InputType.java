package pack.biz_api;

public class InputType {
    private String serviceKey;  
    private String pageNo = "1"; // 기본값 설정
    private String numOfRows = "10"; // 기본값 설정
    private String radius;      // 반경 입력 (미터 단위)
    private String cx;          // 중심점 경도값 (WGS84)
    private String cy;          // 중심점 위도값 (WGS84)

    // 기본 생성자
    public InputType() {}

    // 생성자
    public InputType(String serviceKey, String pageNo, String numOfRows, String radius, String cx, String cy) {
        setServiceKey(serviceKey);
        setPageNo(pageNo);
        setNumOfRows(numOfRows);
        setRadius(radius);
        setCx(cx);
        setCy(cy);
    }

    // 게터와 세터
    public String getServiceKey() {
        return serviceKey;
    }

    public void setServiceKey(String serviceKey) {
        if (serviceKey == null || serviceKey.trim().isEmpty()) {
            throw new IllegalArgumentException("Service key cannot be null or empty");
        }
        this.serviceKey = serviceKey;
    }

    public String getPageNo() {
        return pageNo;
    }

    public void setPageNo(String pageNo) {
        if (pageNo == null || pageNo.trim().isEmpty()) {
            throw new IllegalArgumentException("Page number cannot be null or empty");
        }
        this.pageNo = pageNo;
    }

    public String getNumOfRows() {
        return numOfRows;
    }

    public void setNumOfRows(String numOfRows) {
        if (numOfRows == null || numOfRows.trim().isEmpty()) {
            throw new IllegalArgumentException("Number of rows cannot be null or empty");
        }
        try {
            Integer.parseInt(numOfRows); // 숫자로 변환 시도
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Number of rows must be a valid number");
        }
        this.numOfRows = numOfRows;
    }

    public String getRadius() {
        return radius;
    }

    public void setRadius(String radius) {
        if (radius == null || radius.trim().isEmpty()) {
            throw new IllegalArgumentException("Radius cannot be null or empty");
        }
        try {
            double radiusValue = Double.parseDouble(radius);
            if (radiusValue < 0) {
                throw new IllegalArgumentException("Radius cannot be negative");
            }
            this.radius = radius; // String으로 저장
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Radius must be a valid number");
        }
    }

    public String getCx() {
        return cx;
    }

    public void setCx(String cx) {
        this.cx = cx;
    }

    public String getCy() {
        return cy;
    }

    public void setCy(String cy) {
        this.cy = cy;
    }

    @Override
    public String toString() {
        return "InputType{" +
                "serviceKey='" + serviceKey + '\'' +
                ", pageNo='" + pageNo + '\'' +
                ", numOfRows='" + numOfRows + '\'' +
                ", radius=" + radius +
                ", cx=" + cx +
                ", cy=" + cy +
                '}';
    }
}
