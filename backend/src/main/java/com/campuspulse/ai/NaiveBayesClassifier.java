package com.campuspulse.ai;

import java.util.*;

public class NaiveBayesClassifier {

    private final Map<String, Integer> classDocCounts = new HashMap<>();
    private final Map<String, Map<String, Double>> classTermWeights = new HashMap<>();
    private final Map<String, Double> classTotalWeights = new HashMap<>();
    private final Set<String> vocabulary = new HashSet<>();
    private int totalDocuments = 0;
    private final double alpha = 1.0; // Laplace smoothing parameter

    public void train(List<Map<String, Double>> vectorizedDocs, List<String> labels, Set<String> vocab) {
        classDocCounts.clear();
        classTermWeights.clear();
        classTotalWeights.clear();
        this.vocabulary.clear();
        this.vocabulary.addAll(vocab);
        this.totalDocuments = vectorizedDocs.size();

        for (int i = 0; i < vectorizedDocs.size(); i++) {
            Map<String, Double> docVector = vectorizedDocs.get(i);
            String label = labels.get(i);

            classDocCounts.put(label, classDocCounts.getOrDefault(label, 0) + 1);
            Map<String, Double> termWeights = classTermWeights.computeIfAbsent(label, k -> new HashMap<>());

            double docWeightSum = 0.0;
            for (Map.Entry<String, Double> entry : docVector.entrySet()) {
                String term = entry.getKey();
                double weight = entry.getValue();
                termWeights.put(term, termWeights.getOrDefault(term, 0.0) + weight);
                docWeightSum += weight;
            }

            classTotalWeights.put(label, classTotalWeights.getOrDefault(label, 0.0) + docWeightSum);
        }
    }

    public PredictionResult predict(Map<String, Double> docVector) {
        if (classDocCounts.isEmpty() || docVector.isEmpty()) {
            return new PredictionResult("UNKNOWN", 0.0, Collections.emptyMap());
        }

        Map<String, Double> logLikelihoods = new HashMap<>();
        int vocabSize = Math.max(vocabulary.size(), 1);

        for (String label : classDocCounts.keySet()) {
            // Log prior: ln(P(c))
            double logPrior = Math.log((double) classDocCounts.get(label) / totalDocuments);
            double logLikelihood = logPrior;

            Map<String, Double> termWeights = classTermWeights.getOrDefault(label, Collections.emptyMap());
            double totalWeight = classTotalWeights.getOrDefault(label, 0.0);
            double denominator = totalWeight + (alpha * vocabSize);

            for (Map.Entry<String, Double> entry : docVector.entrySet()) {
                String term = entry.getKey();
                double tfidf = entry.getValue();
                double count = termWeights.getOrDefault(term, 0.0);
                // Smoothed likelihood: (count + alpha) / (totalWeight + alpha * |V|)
                double prob = (count + alpha) / denominator;
                logLikelihood += tfidf * Math.log(prob);
            }

            logLikelihoods.put(label, logLikelihood);
        }

        // Apply Softmax with max subtraction for numerical stability to obtain calibrated confidence scores
        double maxLog = Collections.max(logLikelihoods.values());
        Map<String, Double> probabilities = new HashMap<>();
        double sumExp = 0.0;

        for (Map.Entry<String, Double> entry : logLikelihoods.entrySet()) {
            double expVal = Math.exp(entry.getValue() - maxLog);
            probabilities.put(entry.getKey(), expVal);
            sumExp += expVal;
        }

        String bestClass = "UNKNOWN";
        double highestProb = 0.0;

        for (Map.Entry<String, Double> entry : probabilities.entrySet()) {
            double normalizedProb = entry.getValue() / sumExp;
            probabilities.put(entry.getKey(), normalizedProb);
            if (normalizedProb > highestProb) {
                highestProb = normalizedProb;
                bestClass = entry.getKey();
            }
        }

        return new PredictionResult(bestClass, highestProb, probabilities);
    }

    public static class PredictionResult {
        private final String predictedClass;
        private final double confidence;
        private final Map<String, Double> classProbabilities;

        public PredictionResult(String predictedClass, double confidence, Map<String, Double> classProbabilities) {
            this.predictedClass = predictedClass;
            this.confidence = confidence;
            this.classProbabilities = classProbabilities;
        }

        public String getPredictedClass() {
            return predictedClass;
        }

        public double getConfidence() {
            return confidence;
        }

        public Map<String, Double> getClassProbabilities() {
            return classProbabilities;
        }
    }
}
