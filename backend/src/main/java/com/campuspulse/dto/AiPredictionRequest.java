package com.campuspulse.dto;

public class AiPredictionRequest {

    private String title;
    private String description;

    public AiPredictionRequest() {
    }

    public AiPredictionRequest(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCombinedText() {
        String t = title != null ? title.trim() : "";
        String d = description != null ? description.trim() : "";
        return (t + " " + d).trim();
    }
}
