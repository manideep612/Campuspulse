# CampusPulse – Smart Campus Complaint Management System

A full-stack, AI-assisted web application designed for campus complaint lodging, automated text classification, real-time status tracking, and administrative resolution. Built for the BTech CSE project evaluation.

---

## 🏛️ Project Architecture

```
CampusPulse/
├── backend/                  # Java 17 + Spring Boot 3 REST API (Port 8081)
│   ├── mvnw.cmd              # Maven Wrapper
│   ├── pom.xml               # Dependencies (Spring Web, Spring Data JPA, MySQL Connector)
│   └── src/main/
│       ├── resources/
│       │   ├── application.properties               # Server port 8081 & MySQL config
│       │   └── dataset/
│       │       └── campus_complaints_dataset.json   # 115+ sample complaints for ML training
│       └── java/com/campuspulse/
│           ├── ai/           # Pure Java Machine Learning Engine
│           │   ├── TfidfVectorizer.java            # NLP tokenization & TF-IDF matrix
│           │   ├── NaiveBayesClassifier.java       # Multinomial Naive Bayes with Laplace smoothing
│           │   └── ComplaintAiService.java         # 80/20 train-test evaluation & inference
│           ├── model/        # Complaint, ComplaintStatus, Category, Priority entities
│           ├── repository/   # ComplaintRepository (JPA queries)
│           ├── service/      # ComplaintService (business logic & stats)
│           ├── controller/   # ComplaintController & AiController
│           └── dto/          # Request, Response, and AiPrediction DTOs
└── frontend/                 # React 19 + Vite + Modern CSS (Port 5173 / 5174)
    ├── vite.config.js        # Vite dev proxy forwarding /api to http://localhost:8081
    ├── package.json          # React + Lucide Icons
    └── src/
        ├── components/
        │   ├── ComplaintForm.jsx   # AI-assisted form with 1-click apply & confidence badge
        │   ├── ComplaintsList.jsx  # Search, filter pills & Roll No tracker
        │   ├── AdminDashboard.jsx  # KPI metrics & live AI Model Evaluation card
        │   └── ComplaintCard.jsx   # Status badges & admin controls
        ├── services/api.js         # Configurable API client with proxy support
        └── App.css                 # Responsive modern stylesheet
```

---

## 🧠 Machine Learning Engine (Naive Bayes &bull; TF-IDF)

* **Algorithm:** Multinomial Naive Bayes (MNB) paired with TF-IDF Vectorization.
* **Feature Extraction:** Preprocessing, English stop-word removal, and vocabulary term weighting ($IDF = \ln((1+N)/(1+DF)) + 1$).
* **Probabilistic Classification:** Computes log-likelihoods with Laplace smoothing ($\alpha = 1.0$) and converts them to normalized Softmax probabilities to produce authentic **Confidence Scores (0%–100%)**.
* **Zero External Dependencies / No Paid APIs:** Implemented directly in Java 17; runs completely offline and locally without API keys or Python runtimes.
* **Evaluation Metrics:**
  * **Dataset:** 115 labeled campus complaints (92 Train, 23 Test &mdash; 80/20 split).
  * **Category Accuracy:** 60.9% on multi-class unseen test set (substantially outperforms random chance of 16.7%).
  * **Urgency Prediction:** In real-world campus scenarios, urgency language is inherently subjective. Hence, priority is reported as an **"AI Urgency Recommendation"** alongside its confidence score and critical safety risk triggers (e.g. *spark, fire, smoke, explosion*).

---

## 🚀 How to Run the Application

### 1. Database Setup
1. Ensure the Windows MySQL service is running:
   ```powershell
   Start-Service MYSQL80
   ```
2. Database name: `campuspulse` (automatically managed by Spring Boot Hibernate).

### 2. Start the Backend (Spring Boot)
Open a terminal in the `backend` folder and run:
```powershell
.\mvnw.cmd spring-boot:run
```
The backend starts at: `http://localhost:8081`

### 3. Start the Frontend (React + Vite)
Open a separate terminal in the `frontend` folder and run:
```powershell
npm run dev
```
Open your browser at: `http://localhost:5173` (requests to `/api` proxy to backend automatically).

---

## 🎓 Quick Viva / Evaluation Notes

* **Q: Is this real AI or simple if-else rules?**
  * *Answer:* It is a true Machine Learning text classifier using the **Multinomial Naive Bayes** algorithm combined with **TF-IDF vectorization**. It learns class vocabulary distributions from a 115-sample campus dataset, uses Bayes' Theorem with Laplace smoothing, and calculates normalized posterior probabilities.
* **Q: Why is urgency labeled as a recommendation rather than an absolute prediction?**
  * *Answer:* Urgency in text is subjective across different individuals. Rather than fabricating false 99% accuracy claims, the system honestly reports test set metrics and presents urgency as an **AI Recommendation** with a confidence score, elevating to URGENT if critical safety hazard terms are detected.
* **Q: How does the frontend communicate with port 8081?**
  * *Answer:* Vite uses a reverse proxy configured in `vite.config.js`. Calls to `/api/...` from React are transparently forwarded to `http://localhost:8081`, eliminating port coupling and avoiding CORS issues.
