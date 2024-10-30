package pack;

import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DataWriter implements ItemWriter<Store> {
    
    private final StoreRepository storeRepository;

    @Autowired
    public DataWriter(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    @Override
    public void write(Chunk<? extends Store> items) throws Exception {
    	storeRepository.saveAll(items);
    }
}
