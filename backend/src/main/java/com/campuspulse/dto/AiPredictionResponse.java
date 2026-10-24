package com.campuspulse.dto;

import com.campuspulse.model.Category;
import com.campuspulse.model.Priority;

import java.util.List;
import java.util.Map;

public class AiPredictionResponse {

    private Category predictedCategory;
    private double categoryConfidence;
    private Map<String, Double> categoryProbabilities;

    private Priority predictedPriority;
    private double priorityConfidence;
    private boolean isPriorityRecommendation;
    private String priorityRationale;

    private List<String> detectedKeywords;

    public AiPredictionResponse() {
    }

    public Category getPredictedCategory() {
        return predictedCategory;
    }

    public void setPredictedCategory(Category predictedCategory) {
        this.predictedCategory = predictedCategory;
    }

    public double getCategoryConfidence() {
        return categoryConfidence;
    }

    public void setCategoryConfidence(double categoryConfidence) {
        this.categoryConfidence = categoryConfidence;
    }

    public Map<String, Double> getCategoryProbabilities() {
        return categoryProbabilities;
    }

    public void setCategoryProbabilities(Map<String, Double> categoryProbabilities) {
        this.categoryProbabilities = categoryProbabilities;
    }

    public Priority getPredictedPriority() {
        return predictedPriority;
    }

    public void setPredictedPriority(Priority predictedPriority) {
        this.predictedPriority = predictedPriority;
    }

    public double getPriorityConfidence() {
        return priorityConfidence;
    }

    public void setPriorityConfidence(double priorityConfidence) {
        this.priorityConfidence = priorityConfidence;
    }

    public boolean isPriorityRecommendation() {
        return isPriorityRecommendation;
    }

    public void setPriorityRecommendation(boolean priorityRecommendation) {
        isPriorityRecommendation = priorityRecommendation;
    }

    public String getPriorityRationale() {
        return priorityRationale;
    }

    public void setPriorityRationale(String priorityRationale) {
        this.priorityRationale = priorityRationale;
    }

    public List<String> getDetectedKeywords() {
        return detectedKeywords;
    }

    public void setDetectedKeywords(List<String> detectedKeywords) {
        this.detectedKeywords = detectedKeywords;
    }
}
