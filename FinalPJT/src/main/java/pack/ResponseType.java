package pack;

import java.util.List;

public class ResponseType {
    private String resultCode; // 예: 응답 코드
    private String resultMsg;  // 예: 응답 메시지
    private List<OutputType> data; // OutputType의 리스트로 변경

    // 기본 생성자
    public ResponseType() {}

    // 게터와 세터
    public String getResultCode() {
        return resultCode;
    }

    public void setResultCode(String resultCode) {
        this.resultCode = resultCode;
    }

    public String getResultMsg() {
        return resultMsg;
    }

    public void setResultMsg(String resultMsg) {
        this.resultMsg = resultMsg;
    }

    public List<OutputType> getData() { // 반환 타입 변경
        return data;
    }

    public void setData(List<OutputType> data) { // 파라미터 타입 변경
        this.data = data;
    }
}
