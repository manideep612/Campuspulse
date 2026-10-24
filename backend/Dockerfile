# Stage 1: Build the Spring Boot application using Maven and JDK 17
FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy pom.xml and resolve dependencies first (caches layers for faster builds)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production jar (skip tests for build speed)
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Lightweight runtime image with JRE 17 Alpine
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create and switch to non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Render automatically binds to the port provided by $PORT
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
