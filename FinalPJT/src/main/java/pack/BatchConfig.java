package pack;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@EnableBatchProcessing
public class BatchConfig {

    @Autowired
    private JobRepository jobRepository;

    @Bean
    public Job importUserJob(Step step1) {
        return new JobBuilder("importUserJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(step1)
                .build();
    }

    @Bean
    public Step step1(PlatformTransactionManager transactionManager,
                      ItemReader<OutputType> reader, ItemProcessor<OutputType, Store> processor, // 수정
                      ItemWriter<Store> writer) {
        StepBuilder stepBuilder = new StepBuilder("step1", jobRepository);
        return stepBuilder.<OutputType, Store>chunk(10, transactionManager)
                .reader(reader)
                .processor(processor) // 여기도 수정
                .writer(writer)
                .transactionManager(transactionManager)
                .build();
    }

    @Bean
    @StepScope
    public ItemReader<OutputType> reader(@Value("#{jobParameters['inputType']}") InputType inputType) {
        return new DataReader(inputType); // API에서 InputType 데이터 읽기
    }

    @Bean
    public ItemProcessor<OutputType, Store> processor() { 
        return new DataProcessor(); // OutputType을 Store로 변환
    }

    @Bean
    public ItemWriter<Store> writer(StoreRepository storeRepository) {
        return new DataWriter(storeRepository); // Store 데이터를 처리
    }

}
