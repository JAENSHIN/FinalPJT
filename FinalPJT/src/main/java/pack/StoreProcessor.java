package pack;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Component
public class StoreProcessor {
    private final ObjectMapper objectMapper;
    private static final Logger LOGGER = Logger.getLogger(StoreProcessor.class.getName());

    public StoreProcessor(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public List<Store> processStoreData(String jsonData) {
        List<Store> stores = new ArrayList<>();

        try {
            JsonNode rootNode = objectMapper.readTree(jsonData);
            JsonNode itemsNode = rootNode.path("body").path("items");

            for (JsonNode itemNode : itemsNode) {
                String businessName = Optional.ofNullable(itemNode.path("bizesNm").asText(null)).orElse("Unknown Business");
                String ksicName = Optional.ofNullable(itemNode.path("ksicNm").asText(null)).orElse("Unknown Industry");
                String lnoAddress = Optional.ofNullable(itemNode.path("lnoAdr").asText(null)).orElse("Unknown Address");
                String rdnmAddress = Optional.ofNullable(itemNode.path("rdnmAdr").asText(null)).orElse("Unknown Road Address");
                
                // 위도와 경도에 기본값 설정
                double longitude = itemNode.hasNonNull("lon") ? itemNode.path("lon").asDouble() : 0.0;
                double latitude = itemNode.hasNonNull("lat") ? itemNode.path("lat").asDouble() : 0.0;

                Store store = new Store();
                store.setBusinessName(businessName);
                store.setKsicName(ksicName);
                store.setLnoAddress(lnoAddress);
                store.setRdnmAddress(rdnmAddress);
                store.setLongitude(longitude);
                store.setLatitude(latitude);	

                stores.add(store);
            }
        } catch (IOException e) {
            LOGGER.severe("JSON 파싱 오류: " + e.getMessage());
        }

        return stores;
    }
}
