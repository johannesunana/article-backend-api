# Article Backend API
This is a backend API application for a simple article publishing platform.

## Phase 1 Authentication Features
- User registration via email and password
- User login and authentication using JWT tokens

## Endpoints
- `POST /auth/register`: Register a new user
- `POST /auth/login`: Authenticate a user and receive a JWT token
- `GET /auth/me`: Retrieve the authenticated user's profile

## How to set up
1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd article-backend-api
    ```
2. Install dependencies:
   ```bash
    npm install
    ```
3. Set up environment variables

    Create a `.env` file in the root   directory and add the following variables:
    ```
    DATABASE_URL=postgresql://user:password@localhost:5432/article_backend_api
    JWT_SECRET=your_jwt_secret_key
    ```
4. Run the database migrations:
    ```bash
    npx prisma migrate dev
    ```
5. Start the server:
    ```bash
    node src/app.js
    ```
