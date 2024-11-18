package pack.biz_api;

public class OutputType {
    private String locationName;     // 예: 시군구 이름 또는 읍면동 이름
    private String latitude;          // 위도
    private String longitude;         // 경도
    private String lnoAddress;        // 지번 주소
    private String rdnmAddress;       // 도로명 주소
    private String ksicName;		// 산업명
    private String ksicCd;			// 산업 코드
    
    // 기본 생성자
    public OutputType() {}

    // 생성자
    public OutputType(String locationName, String latitude, String longitude, String ksicName, String ksicCd, String lnoAddress, String rdnmAddress) {
        this.locationName = locationName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.ksicName = ksicName;
        this.ksicCd = ksicCd;
        this.lnoAddress = lnoAddress;    // 지번 주소
        this.rdnmAddress = rdnmAddress;  // 도로명 주소
    }

    // 게터와 세터
    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getKsicName() {
        return ksicName;
    }

    public void setKsicName(String ksicName) {
        this.ksicName = ksicName;
    }
    
    public String getKsicCd() {
        return ksicName;
    }

    public void setKsicCd(String ksicCd) {
        this.ksicCd = ksicCd;
    }

    public String getLnoAddress() {
        return lnoAddress; // 지번 주소
    }

    public void setLnoAddress(String lnoAddress) {
        this.lnoAddress = lnoAddress; // 지번 주소 설정
    }

    public String getRdnmAddress() {
        return rdnmAddress; // 도로명 주소
    }

    public void setRdnmAddress(String rdnmAddress) {
        this.rdnmAddress = rdnmAddress; // 도로명 주소 설정
    }

    @Override
    public String toString() {
        return "OutputType [locationName=" + locationName + 
               ", latitude=" + latitude + 
               ", longitude=" + longitude + 
               ", ksicName=" + ksicName +
               ", lnoAddress=" + lnoAddress + 
               ", rdnmAddress=" + rdnmAddress + "]";
    }
}
