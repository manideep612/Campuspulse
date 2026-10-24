package com.campuspulse.dto;

import java.util.Map;

public class AiModelMetrics {

    private String algorithm;
    private int totalDatasetSize;
    private int trainingSetSize;
    private int testSetSize;
    private double categoryAccuracy;
    private double priorityAccuracy;
    private int vocabularySize;
    private Map<String, Integer> categoryDistribution;
    private Map<String, Integer> priorityDistribution;
    private String priorityLimitationNote;

    public AiModelMetrics() {
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public int getTotalDatasetSize() {
        return totalDatasetSize;
    }

    public void setTotalDatasetSize(int totalDatasetSize) {
        this.totalDatasetSize = totalDatasetSize;
    }

    public int getTrainingSetSize() {
        return trainingSetSize;
    }

    public void setTrainingSetSize(int trainingSetSize) {
        this.trainingSetSize = trainingSetSize;
    }

    public int getTestSetSize() {
        return testSetSize;
    }

    public void setTestSetSize(int testSetSize) {
        this.testSetSize = testSetSize;
    }

    public double getCategoryAccuracy() {
        return categoryAccuracy;
    }

    public void setCategoryAccuracy(double categoryAccuracy) {
        this.categoryAccuracy = categoryAccuracy;
    }

    public double getPriorityAccuracy() {
        return priorityAccuracy;
    }

    public void setPriorityAccuracy(double priorityAccuracy) {
        this.priorityAccuracy = priorityAccuracy;
    }

    public int getVocabularySize() {
        return vocabularySize;
    }

    public void setVocabularySize(int vocabularySize) {
        this.vocabularySize = vocabularySize;
    }

    public Map<String, Integer> getCategoryDistribution() {
        return categoryDistribution;
    }

    public void setCategoryDistribution(Map<String, Integer> categoryDistribution) {
        this.categoryDistribution = categoryDistribution;
    }

    public Map<String, Integer> getPriorityDistribution() {
        return priorityDistribution;
    }

    public void setPriorityDistribution(Map<String, Integer> priorityDistribution) {
        this.priorityDistribution = priorityDistribution;
    }

    public String getPriorityLimitationNote() {
        return priorityLimitationNote;
    }

    public void setPriorityLimitationNote(String priorityLimitationNote) {
        this.priorityLimitationNote = priorityLimitationNote;
    }
}
