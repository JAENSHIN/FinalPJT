package pack;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BatchController {

    private final JobLauncher jobLauncher;
    private final Job job;

    public BatchController(JobLauncher jobLauncher, Job job) {
        this.jobLauncher = jobLauncher;
        this.job = job;
    }

    @PostMapping("/run-batch")
    public String runBatchJob(@RequestParam String coordinates) {
        try {
            jobLauncher.run(job, new JobParametersBuilder()
                .addString("coordinates", coordinates)
                .toJobParameters());
            return "Batch job started successfully!";
        } catch (Exception e) {
            return "Failed to start batch job: " + e.getMessage();
        }
    }
}
