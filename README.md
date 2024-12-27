# URL Shortener

This is a URL Shortener application hosted at [https://url-shortener-c3rj.onrender.com](https://url-shortener-c3rj.onrender.com). You can find the API documentation at [https://url-shortener-c3rj.onrender.com/api-docs](https://url-shortener-c3rj.onrender.com/api-docs).

## Technologies Used

- Node.js
- Express
- PostgreSQL (from Neon)
- Redis (from Upstash)
- Render.com
- Docker
- Swagger UI

## Getting Started

### Prerequisites

- Docker installed on your local machine

### Running the Application Locally

1. Clone the repository:
    ```sh
    git clone https://github.com/AkhileshThykkat/URL-Shortener.git
    cd URL-Shortener
    ```
2. Create a `.env` file in the root directory and add the following
    ```env
    PORT=3000
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
    GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
    GOOGLE_AUTH_PROVIDER_URL=https://www.googleapis.com/oauth2/v1/certs
    GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
    JWT_SECRET=your-jwt-secret
    DB_NAME=your-database-name
    DB_USER=your-database-user
    DB_PASSWORD=your-database-password
    DB_HOST=your-database-host
    REDIS_URL=your-redis-url
    API_BASE_URL=http://localhost:3000
    ```
3. Build the Docker image:
    ```sh
    docker build -t url-shortener .
    ```

4. Run the Docker container:
    ```sh
    docker run -p 3000:3000 url-shortener
    ```

5. Access the application:
    Open your browser and navigate to `http://localhost:3000`.

6. Access the API documentation:
    Open your browser and navigate to `http://localhost:3000/api-docs`.

## Scaling Suggestions

1. **Database Optimization**: Use connection pooling and indexing to improve database performance.
2. **Load Balancing**: Implement load balancing to distribute traffic across multiple instances.
3. **Caching**: Use Redis for caching frequently accessed data to reduce database load.
4. **Logging**: Implement logging for track performance and identify bottlenecks.
