# CampusPulse – Smart Campus Complaint Management System

A full-stack web application designed for campus complaint lodging, real-time status tracking, and administrative resolution. Built for the BTech CSE project evaluation.

---

## 🏛️ Project Architecture

```
CampusPulse/
├── backend/                  # Java 17 + Spring Boot 3 REST API
│   ├── mvnw.cmd              # Maven Wrapper (no standalone Maven needed)
│   ├── pom.xml               # Dependencies (Spring Web, Spring Data JPA, MySQL Connector)
│   └── src/main/java/com/campuspulse/
│       ├── model/            # Complaint, ComplaintStatus, Category, Priority entities
│       ├── repository/       # ComplaintRepository (JPA queries)
│       ├── service/          # ComplaintService (business logic & stats)
│       ├── controller/       # ComplaintController (REST endpoints)
│       ├── dto/              # Request / Response DTOs
│       └── config/           # CORS, GlobalExceptionHandler, Sample Data Initializer
└── frontend/                 # React 19 + Vite + Modern CSS
    ├── package.json          # React + Lucide Icons
    └── src/
        ├── components/       # ComplaintForm, ComplaintsList, AdminDashboard, Cards
        ├── services/api.js   # Fetch API integration with backend
        ├── App.jsx           # Tab routing & state management
        └── App.css           # Responsive modern styling
```

---

## 🚀 How to Run the Application

### 1. Database Setup
1. Ensure the Windows MySQL service is running:
   ```powershell
   Start-Service MYSQL80
   ```
2. Your MySQL root password can be set in `backend/src/main/resources/application.properties` (or set environment variable `$env:MYSQL_PASSWORD = 'your_password'`).
3. The database `campuspulse_db` and tables will be created **automatically** on startup!

### 2. Start the Backend (Spring Boot)
Open a terminal in the `backend` folder and run:
```powershell
.\mvnw.cmd spring-boot:run
```
The backend will start at: `http://localhost:8080`

### 3. Start the Frontend (React + Vite)
Open a separate terminal in the `frontend` folder and run:
```powershell
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## 🎓 Quick Viva / Evaluation Notes for Tomorrow

* **Q: What is the tech stack?**
  * *Frontend:* React (Vite) with responsive CSS & Lucide Icons.
  * *Backend:* Java 17, Spring Boot 3.3.4, Spring Data JPA / Hibernate.
  * *Database:* MySQL 8.0 with InnoDB engine.
* **Q: What REST endpoints are implemented?**
  * `POST /api/complaints`: Submits a complaint with field validations.
  * `GET /api/complaints`: Lists all complaints with category, status, and search filters.
  * `PATCH /api/complaints/{id}/status`: Updates status (`PENDING`, `IN_PROGRESS`, `RESOLVED`) & admin remarks.
  * `DELETE /api/complaints/{id}`: Deletes a resolved or duplicate complaint.
  * `GET /api/complaints/stats`: Computes live counts and category breakdown for the dashboard.
* **Q: What are the complaint categories?**
  * Electricity, Water, Cleanliness, Furniture, Internet, and Other.
