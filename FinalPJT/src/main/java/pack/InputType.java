package pack;

public class InputType {
    private String serviceKey;  
    private String pageNo = "1"; // 기본값 설정
    private String numOfRows = "10"; // 기본값 설정
    private double radius;      // 반경 입력 (미터 단위)
    private double cx;          // 중심점 경도값 (WGS84)
    private double cy;          // 중심점 위도값 (WGS84)
    private String type; 

    // 기본 생성자
    public InputType() {}

    // 생성자
    public InputType(String serviceKey, String pageNo, String numOfRows, double radius, double cx, double cy, String type) {
        setServiceKey(serviceKey);
        setPageNo(pageNo);
        setNumOfRows(numOfRows);
        setRadius(radius);
        setCx(cx);
        setCy(cy);
        setType(type);
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
        this.numOfRows = numOfRows;
    }

    public double getRadius() {
        return radius;
    }

    public void setRadius(double radius) {
        if (radius < 0) {
            throw new IllegalArgumentException("Radius cannot be negative");
        }
        this.radius = radius;
    }

    public double getCx() {
        return cx;
    }

    public void setCx(double cx) {
        this.cx = cx;
    }

    public double getCy() {
        return cy;
    }

    public void setCy(double cy) {
        this.cy = cy;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        if (type == null || type.trim().isEmpty()) {
            throw new IllegalArgumentException("Type cannot be null or empty");
        }
        this.type = type;
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
                ", type='" + type + '\'' +
                '}';
    }
}
