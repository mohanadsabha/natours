# Natours - Tour Booking Website

A feature-rich, full-stack tour booking application built during the "Node.js, Express, MongoDB & More: The Complete Bootcamp" course by Jonas Schmedtmann on Udemy.

## 🚀 Features

-   🌍 Tour listings with detailed info, pricing, and maps
-   🛒 User authentication and authorization (JWT)
-   📦 Role-based access control (Admin, Lead-Guide, User)
-   📅 Tour bookings and payment integration (Stripe)
-   🗺️ Interactive maps with Mapbox
-   📧 Email notifications (SendGrid)
-   📸 Image upload and processing
-   📊 Data validation and sanitization

## 🛠️ Technologies Used

-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB, Mongoose
-   **Authentication:** JWT, Cookies
-   **Payments:** Stripe
-   **Email:** Nodemailer + SendGrid
-   **File Uploads:** Multer + Sharp
-   **Geolocation & Maps:** Mapbox
-   **Security:** Helmet, rate-limiting, XSS protection, etc.

## 📂 Project Structure

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/mohanadsabha/natours.git
    ```
2. Navigate to the project directory:
    ```bash
    cd natours
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1. Create a `.env` file in the root directory.
2. Add the following environment variables:
    ```env
    PORT=3000
    DATABASE=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=90d
    JWT_COOKIE_EXPIRES_IN=90
    EMAIL_HOST=your_email_host
    EMAIL_PORT=email_port
    EMAIL_USERNAME=your_email
    EMAIL_PASSWORD=your_email_password
    EMAIL_FROM=natours@example.io
    STRIPE_SECRET_KEY=your_stripe_key
    ```

## Usage

1. Start the development server:
    ```bash
    npm run dev
    ```
2. Access the API at `http://localhost:3000`.

## API Endpoints

#### Tours
- **Get All Tours**  
    `GET /api/v1/tours?price[gte]=500`  
    Fetch all tours with optional filters (e.g., price, difficulty).

- **Get Tour**  
    `GET /api/v1/tours/:id`  
    Fetch details of a specific tour by ID.

- **Create New Tour**  
    `POST /api/v1/tours`  
    Requires authentication (Bearer token).  
    Create a new tour with details in the request body.

- **Update Tour**  
    `PATCH /api/v1/tours/:id`  
    Requires authentication (Bearer token).  
    Update specific fields of a tour by ID.

- **Delete Tour**  
    `DELETE /api/v1/tours/:id`  
    Requires authentication (Bearer token).  
    Delete a specific tour by ID.

- **Get Top 5 Cheap Tours**  
    `GET /api/v1/tours/top-5-tours`  
    Fetch the top 5 cheapest tours.

- **Get Monthly Plan**  
    `GET /api/v1/tours/monthly-plan/:year`  
    Requires authentication (Bearer token).  
    Fetch a monthly plan for tours in a specific year.

- **Get Tour Stats**  
    `GET /api/v1/tours/tour-stats`  
    Fetch aggregated statistics for tours.

#### Reviews
- **Get All Reviews**  
    `GET /api/v1/reviews`  
    Requires authentication (Bearer token).  
    Fetch all reviews.

- **Create New Review**  
    `POST /api/v1/reviews`  
    Requires authentication (Bearer token).  
    Create a new review with details in the request body.

- **Update Review**  
    `PATCH /api/v1/reviews/:id`  
    Requires authentication (Bearer token).  
    Update a specific review by ID.

- **Delete Review**  
    `DELETE /api/v1/reviews/:id`  
    Requires authentication (Bearer token).  
    Delete a specific review by ID.

- **Get All Reviews on Tour**  
    `GET /api/v1/tours/:tourId/reviews`  
    Requires authentication (Bearer token).  
    Fetch all reviews for a specific tour.

- **Create New Review on Tour**  
    `POST /api/v1/tours/:tourId/reviews`  
    Requires authentication (Bearer token).  
    Create a new review for a specific tour.

#### Users
- **Get All Users**  
    `GET /api/v1/users`  
    Requires authentication (Bearer token).  
    Fetch all users.

- **Get User**  
    `GET /api/v1/users/:id`  
    Fetch details of a specific user by ID.

- **Update Current User**  
    `PATCH /api/v1/users/updateMe`  
    Update the currently logged-in user's details.

- **Delete Current User**  
    `DELETE /api/v1/users/deleteMe`  
    Delete the currently logged-in user's account.

- **Delete User**  
    `DELETE /api/v1/users/:id`  
    Requires authentication (Bearer token).  
    Delete a specific user by ID.

#### Authentication
- **Sign Up**  
    `POST /api/v1/users/signup`  
    Create a new user account.

- **Login**  
    `POST /api/v1/users/login`  
    Log in and receive a JWT token.

- **Forgot Password**  
    `POST /api/v1/users/forgotPassword`  
    Request a password reset link.

- **Reset Password**  
    `PATCH /api/v1/users/resetPassword/:token`  
    Reset the password using a valid token.

#### Bookings
- **Get Checkout Session**  
    `GET /api/v1/bookings/checkout-session/:tourId`  
    Requires authentication (Bearer token).  
    Fetch a Stripe checkout session for a specific tour.