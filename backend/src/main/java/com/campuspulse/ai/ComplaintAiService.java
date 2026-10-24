package com.campuspulse.ai;

import com.campuspulse.dto.AiModelMetrics;
import com.campuspulse.dto.AiPredictionRequest;
import com.campuspulse.dto.AiPredictionResponse;
import com.campuspulse.model.Category;
import com.campuspulse.model.Priority;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;

@Service
public class ComplaintAiService {

    private static final Logger log = LoggerFactory.getLogger(ComplaintAiService.class);

    private final TfidfVectorizer vectorizer = new TfidfVectorizer();
    private final NaiveBayesClassifier categoryClassifier = new NaiveBayesClassifier();
    private final NaiveBayesClassifier priorityClassifier = new NaiveBayesClassifier();
    private final AiModelMetrics metrics = new AiModelMetrics();

    private static final Set<String> HIGH_URGENCY_TRIGGERS = new HashSet<>(Arrays.asList(
            "spark", "sparking", "smoke", "fire", "shock", "flame", "blast", "explosion",
            "collapse", "flooding", "burst", "hazard", "bleeding", "emergency", "fatal",
            "critical", "suffocating", "fumes", "poisonous", "trap", "trapped"
    ));

    @PostConstruct
    public void init() {
        trainAndEvaluate();
    }

    public synchronized void trainAndEvaluate() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = new ClassPathResource("dataset/campus_complaints_dataset.json").getInputStream();
            List<Map<String, String>> dataset = mapper.readValue(is, new TypeReference<List<Map<String, String>>>() {});

            if (dataset == null || dataset.isEmpty()) {
                log.warn("Campus complaint AI dataset is empty or not found.");
                return;
            }

            // Shuffle with fixed seed for reproducible evaluation
            List<Map<String, String>> shuffled = new ArrayList<>(dataset);
            Collections.shuffle(shuffled, new Random(42));

            int totalSize = shuffled.size();
            int trainSize = (int) (totalSize * 0.80);
            int testSize = totalSize - trainSize;

            List<Map<String, String>> trainSet = shuffled.subList(0, trainSize);
            List<Map<String, String>> testSet = shuffled.subList(trainSize, totalSize);

            List<String> trainTexts = new ArrayList<>();
            List<String> trainCategories = new ArrayList<>();
            List<String> trainPriorities = new ArrayList<>();

            Map<String, Integer> catDist = new HashMap<>();
            Map<String, Integer> priDist = new HashMap<>();

            for (Map<String, String> item : trainSet) {
                String text = item.get("text");
                String cat = item.get("category");
                String pri = item.get("priority");

                trainTexts.add(text);
                trainCategories.add(cat);
                trainPriorities.add(pri);

                catDist.put(cat, catDist.getOrDefault(cat, 0) + 1);
                priDist.put(pri, priDist.getOrDefault(pri, 0) + 1);
            }

            // 1. Fit TF-IDF Vectorizer
            vectorizer.fit(trainTexts);

            // 2. Transform training documents
            List<Map<String, Double>> trainVectors = new ArrayList<>();
            for (String text : trainTexts) {
                trainVectors.add(vectorizer.transform(text));
            }

            // 3. Train Category and Priority Classifiers
            Set<String> vocab = vectorizer.getVocabulary();
            categoryClassifier.train(trainVectors, trainCategories, vocab);
            priorityClassifier.train(trainVectors, trainPriorities, vocab);

            // 4. Honest Evaluation on Unseen Test Set
            int catCorrect = 0;
            int priCorrect = 0;

            for (Map<String, String> testItem : testSet) {
                String testText = testItem.get("text");
                String trueCat = testItem.get("category");
                String truePri = testItem.get("priority");

                Map<String, Double> testVec = vectorizer.transform(testText);

                NaiveBayesClassifier.PredictionResult catPred = categoryClassifier.predict(testVec);
                if (catPred.getPredictedClass().equalsIgnoreCase(trueCat)) {
                    catCorrect++;
                }

                NaiveBayesClassifier.PredictionResult priPred = priorityClassifier.predict(testVec);
                if (priPred.getPredictedClass().equalsIgnoreCase(truePri)) {
                    priCorrect++;
                }
            }

            double catAccuracy = (double) catCorrect / testSize;
            double priAccuracy = (double) priCorrect / testSize;

            metrics.setAlgorithm("Multinomial Naive Bayes with TF-IDF Vectorization");
            metrics.setTotalDatasetSize(totalSize);
            metrics.setTrainingSetSize(trainSize);
            metrics.setTestSetSize(testSize);
            metrics.setCategoryAccuracy(Math.round(catAccuracy * 1000.0) / 10.0);
            metrics.setPriorityAccuracy(Math.round(priAccuracy * 1000.0) / 10.0);
            metrics.setVocabularySize(vocab.size());
            metrics.setCategoryDistribution(catDist);
            metrics.setPriorityDistribution(priDist);
            metrics.setPriorityLimitationNote("Urgency language is subjective across campus issues. Category classifier achieves high accuracy (" 
                    + metrics.getCategoryAccuracy() + "%), whereas Urgency prediction is served as an AI Recommendation (" 
                    + metrics.getPriorityAccuracy() + "% baseline test accuracy).");

            log.info("=== CampusPulse AI Model Initialized ===");
            log.info("Total Samples: {} (Train: {}, Test: {})", totalSize, trainSize, testSize);
            log.info("Vocabulary Size: {} distinct terms", vocab.size());
            log.info("Category Test Accuracy: {}%", metrics.getCategoryAccuracy());
            log.info("Priority Test Accuracy: {}%", metrics.getPriorityAccuracy());

        } catch (Exception e) {
            log.error("Failed to train AI model from dataset: {}", e.getMessage(), e);
        }
    }

    public AiPredictionResponse predict(AiPredictionRequest request) {
        String combined = request.getCombinedText();
        AiPredictionResponse response = new AiPredictionResponse();

        if (combined.isEmpty()) {
            response.setPredictedCategory(Category.OTHER);
            response.setCategoryConfidence(0.0);
            response.setPredictedPriority(Priority.MEDIUM);
            response.setPriorityConfidence(0.0);
            response.setPriorityRecommendation(true);
            response.setPriorityRationale("Please provide an issue title or description for AI analysis.");
            response.setDetectedKeywords(Collections.emptyList());
            return response;
        }

        Map<String, Double> vector = vectorizer.transform(combined);

        // 1. Category Prediction via Naive Bayes
        NaiveBayesClassifier.PredictionResult catResult = categoryClassifier.predict(vector);
        Category predictedCat = parseCategory(catResult.getPredictedClass());
        response.setPredictedCategory(predictedCat);
        response.setCategoryConfidence(Math.round(catResult.getConfidence() * 1000.0) / 10.0);
        response.setCategoryProbabilities(catResult.getClassProbabilities());

        // 2. Priority Prediction via Naive Bayes + Safety Risk Analysis
        NaiveBayesClassifier.PredictionResult priResult = priorityClassifier.predict(vector);
        Priority predictedPri = parsePriority(priResult.getPredictedClass());
        double priConfidence = Math.round(priResult.getConfidence() * 1000.0) / 10.0;

        // Check for severe hazard terminology
        List<String> tokens = vectorizer.tokenize(combined);
        boolean containsHazard = false;
        String detectedTrigger = "";
        for (String token : tokens) {
            if (HIGH_URGENCY_TRIGGERS.contains(token)) {
                containsHazard = true;
                detectedTrigger = token;
                break;
            }
        }

        if (containsHazard) {
            predictedPri = Priority.URGENT;
            priConfidence = Math.max(priConfidence, 85.0);
            response.setPriorityRationale("Elevated to URGENT due to critical safety term: '" + detectedTrigger + "'.");
        } else {
            response.setPriorityRationale("Recommended as " + predictedPri + " based on learned campus urgency patterns (" + priConfidence + "% confidence).");
        }

        response.setPredictedPriority(predictedPri);
        response.setPriorityConfidence(priConfidence);
        response.setPriorityRecommendation(true); // Always clearly labeled as recommendation

        // Extract top 5 relevant keywords sorted by TF-IDF weight
        List<Map.Entry<String, Double>> sortedWeights = new ArrayList<>(vector.entrySet());
        sortedWeights.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));

        List<String> topKeywords = new ArrayList<>();
        for (int i = 0; i < Math.min(5, sortedWeights.size()); i++) {
            topKeywords.add(sortedWeights.get(i).getKey());
        }
        response.setDetectedKeywords(topKeywords);

        return response;
    }

    public AiModelMetrics getMetrics() {
        return metrics;
    }

    private Category parseCategory(String label) {
        try {
            return Category.valueOf(label.toUpperCase());
        } catch (Exception e) {
            return Category.OTHER;
        }
    }

    private Priority parsePriority(String label) {
        try {
            return Priority.valueOf(label.toUpperCase());
        } catch (Exception e) {
            return Priority.MEDIUM;
        }
    }
}
