package com.campuspulse.ai;

import java.util.*;
import java.util.regex.Pattern;

public class TfidfVectorizer {

    private static final Set<String> STOP_WORDS = new HashSet<>(Arrays.asList(
            "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
            "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but",
            "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from",
            "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him",
            "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just", "me",
            "more", "most", "my", "myself", "no", "nor", "not", "now", "of", "off", "on", "once", "only",
            "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she",
            "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves",
            "then", "there", "these", "they", "this", "those", "through", "to", "too", "under", "until",
            "up", "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom",
            "why", "with", "would", "you", "your", "yours", "yourself", "yourselves"
    ));

    private static final Pattern WORD_PATTERN = Pattern.compile("[^a-zA-Z0-9]+");

    private final Map<String, Integer> vocabulary = new HashMap<>();
    private final Map<String, Double> idfMap = new HashMap<>();
    private int documentCount = 0;

    public void fit(List<String> documents) {
        vocabulary.clear();
        idfMap.clear();
        documentCount = documents.size();

        Map<String, Integer> docFreq = new HashMap<>();

        for (String doc : documents) {
            Set<String> uniqueWords = new HashSet<>(tokenize(doc));
            for (String word : uniqueWords) {
                docFreq.put(word, docFreq.getOrDefault(word, 0) + 1);
            }
        }

        int index = 0;
        for (Map.Entry<String, Integer> entry : docFreq.entrySet()) {
            String word = entry.getKey();
            int df = entry.getValue();
            vocabulary.put(word, index++);
            // Smooth IDF calculation: ln((1 + N) / (1 + df)) + 1
            double idf = Math.log((1.0 + documentCount) / (1.0 + df)) + 1.0;
            idfMap.put(word, idf);
        }
    }

    public Map<String, Double> transform(String document) {
        List<String> tokens = tokenize(document);
        Map<String, Double> tfMap = new HashMap<>();

        if (tokens.isEmpty()) {
            return tfMap;
        }

        // Calculate term frequency
        for (String token : tokens) {
            if (vocabulary.containsKey(token)) {
                tfMap.put(token, tfMap.getOrDefault(token, 0.0) + 1.0);
            }
        }

        double totalTokens = tokens.size();
        Map<String, Double> tfidfVector = new HashMap<>();
        double norm = 0.0;

        for (Map.Entry<String, Double> entry : tfMap.entrySet()) {
            String term = entry.getKey();
            double tf = entry.getValue() / totalTokens;
            double idf = idfMap.getOrDefault(term, 1.0);
            double tfidf = tf * idf;
            tfidfVector.put(term, tfidf);
            norm += tfidf * tfidf;
        }

        // L2 normalization
        norm = Math.sqrt(norm);
        if (norm > 0) {
            for (Map.Entry<String, Double> entry : tfidfVector.entrySet()) {
                entry.setValue(entry.getValue() / norm);
            }
        }

        return tfidfVector;
    }

    public List<String> tokenize(String text) {
        if (text == null || text.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String[] parts = WORD_PATTERN.split(text.toLowerCase().trim());
        List<String> tokens = new ArrayList<>();

        for (String part : parts) {
            if (part.length() > 2 && !STOP_WORDS.contains(part)) {
                tokens.add(part);
            }
        }

        return tokens;
    }

    public Set<String> getVocabulary() {
        return vocabulary.keySet();
    }
}
