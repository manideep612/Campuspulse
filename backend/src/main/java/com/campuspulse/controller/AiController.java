package com.campuspulse.controller;

import com.campuspulse.ai.ComplaintAiService;
import com.campuspulse.dto.AiModelMetrics;
import com.campuspulse.dto.AiPredictionRequest;
import com.campuspulse.dto.AiPredictionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private final ComplaintAiService aiService;

    @Autowired
    public AiController(ComplaintAiService aiService) {
        this.aiService = aiService;
    }

    /**
     * Predict category and urgency recommendation using local Multinomial Naive Bayes model
     */
    @PostMapping("/predict")
    public ResponseEntity<AiPredictionResponse> predict(@RequestBody AiPredictionRequest request) {
        AiPredictionResponse prediction = aiService.predict(request);
        return ResponseEntity.ok(prediction);
    }

    /**
     * Get actual model training evaluation metrics (Accuracy, Vocabulary, Train/Test Split)
     */
    @GetMapping("/metrics")
    public ResponseEntity<AiModelMetrics> getMetrics() {
        AiModelMetrics metrics = aiService.getMetrics();
        return ResponseEntity.ok(metrics);
    }
}
