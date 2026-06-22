FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

FROM maven:3.9-eclipse-temurin-17 AS backend-build

WORKDIR /app
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B
COPY backend/src ./src
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static
RUN mvn package -DskipTests -B

FROM eclipse-temurin:17-jre

WORKDIR /app
COPY --from=backend-build /app/target/fullstock-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["sh", "-c", "if [ -n \"$DATABASE_URL\" ]; then DB_URL=\"$DATABASE_URL\"; DB_URL=\"${DB_URL#jdbc:}\"; DB_URL=\"${DB_URL/postgres:\\/\\//postgresql:\\/\\/}\"; export SPRING_DATASOURCE_URL=\"jdbc:$DB_URL\"; fi; exec java -jar app.jar"]
