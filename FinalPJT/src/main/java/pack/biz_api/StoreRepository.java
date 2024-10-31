package pack.biz_api;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreRepository extends JpaRepository<Store, Long> {
    // Store 엔티티를 데이터베이스에 저장하기 위한 JpaRepository
}
