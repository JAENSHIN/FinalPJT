package pack;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Store {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
    private String businessName;
    private String ksicName;
    private String ksicCd;
    private String lnoAddress;
    private String rdnmAddress;
    private double longitude;
    private double latitude;

    // 기본 생성자
    public Store() {}

    // 게터와 세터
    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getKsicName() {
        return ksicName;
    }

    public void setKsicName(String ksicName) {
        this.ksicName = ksicName;
    }
    
    public String getKsicCd() {
        return ksicCd;
    }

    public void setKsicCd(String ksicCd) {
        this.ksicCd = ksicCd;
    }
    
    public String getLnoAddress() {
        return lnoAddress;
    }

    public void setLnoAddress(String lnoAddress) {
        this.lnoAddress = lnoAddress;
    }

    public String getRdnmAddress() {
        return rdnmAddress;
    }

    public void setRdnmAddress(String rdnmAddress) {
        this.rdnmAddress = rdnmAddress;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }
}
