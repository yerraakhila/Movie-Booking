# Movie Booking App

**Date:** 21st September 2024  
**Author:** Yerra Akhila  

## Overview

The Movie Booking App provides users with a seamless experience for discovering, booking, and managing movie tickets. Users can explore the latest movies, view showtimes, select seats, and book tickets easily.

## Requirements

### User Registration and Profile Management
- Users can create accounts using email or social media.
- Profile management includes viewing past bookings and updating preferences.

### Movie Discovery
- Browse movies by genre, release date, and popularity.
- Detailed movie pages featuring synopses, trailers, cast information, and reviews.

### Showtime and Seat Selection
- Real-time availability of showtimes for various cinemas.
- Interactive seat selection interface with color-coded options.

### Payment Processing
- Order summary and ticket confirmation post-payment.

### Admin Dashboard (Future Scope)
- Management interface for cinema owners to update movie listings, manage showtimes, and view sales analytics.

## User Flow

### Frontend URLs

- `/movies/<city>/` - List movies by city
- `/movies-search/` - Search for movies
- `/<city>/movie-detail/<id>/` - View movie details
- `/<city>/movie-screenings/<movie_id>/<date>/` - View screenings for a movie on a specific date
- `/<city>/screening-seats/<screening_id>/` - View seat availability for a screening
- `/select-seats/` - Endpoint for selecting seats
- `/<city>/booking-detail/<booking_id>/` - View booking details (pending state)
- `/booking-pay/<booking_id>/` - Payment processing for booking
- `/<city>/booking-confirmed-detail/<booking_id>/` - Booking confirmation details
- `/my-bookings/` - View user's past bookings
- `/user-profile/` - User profile management
- `/signup/` - User signup
- `/signin/` - User login
- `/<city>/single-screening/<screening_id>/` - View details for a single screening

### Backend Models

#### Movie Model
- `id`: Primary Key
- `title`, `description`, `rating`, `review`
- `genre`, `languages`
- `release_date`, `running_time`
- `trailer_url`, `poster_url`
- `actors`, `director`

#### Theatre Model
- `id`: Primary Key
- `name`, `address`, `city`

#### Screening Model
- `id`: Primary Key
- `movie`: Foreign Key to Movie
- `theatre`: Foreign Key to Theatre
- `city`, `date_time`

#### User Model
- `id`: Primary Key
- `username`, `name`, `email`, `password`
- `is_active`: User status
- Custom `UserManager` for user and superuser creation

#### Booking Model
- `booking_id`: Primary Key
- `user`: Foreign Key to User
- `screening`: Foreign Key to Screening
- `status`: Booking status (`pending`, `confirmed`, `cancelled`)
- `created_at`, `updated_at`

#### Seat Model
- `id`: Primary Key
- `row`, `number`
- `is_premium`: Premium seat flag
- `cost`: Seat cost
- `screening`: Foreign Key to Screening
- `booking`: Foreign Key to Booking (nullable)

### Backend APIs

#### User APIs

1. **User Registration**
   - **Endpoint**: `POST /api/signup`
   - **Request Body**:
     ```json
     {
       "username": "string",
       "password": "string",
       "email": "string",
       "name": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "access_token": "string",
       "refresh_token": "string"
     }
     ```

2. **User Login**
   - **Endpoint**: `POST /api/login`
   - **Request Body**:
     ```json
     {
       "username": "string",
       "password": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "access_token": "string",
       "refresh_token": "string"
     }
     ```

3. **Get User Profile**
   - **Endpoint**: `GET /api/user/profile`
   - **Headers**: `Authorization: Bearer <access_token>`
   - **Response**:
     ```json
     {
       "username": "string",
       "name": "string",
       "email": "string",
       "past_bookings": ["booking_id1", "booking_id2", ...]
     }
     ```

4. **Update User Profile**
   - **Endpoint**: `PUT /api/user/profile`
   - **Headers**: `Authorization: Bearer <access_token>`
   - **Request Body**:
     ```json
     {
       "name": "string",
       "email": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Profile updated successfully"
     }
     ```

## Design

### Database Indexes
- Index on `movie`, `city`, and `date_time` fields in the `Screening` model for efficient querying of screenings.

### Security
- CSRF protection applied where necessary.
- JWT tokens used for authentication.

## Future Enhancements
- Integration with payment gateways for processing payments.
- Admin dashboard for cinema owners to manage listings and view analytics.
- Additional filters for movie discovery (e.g., by rating or language).

---

This document provides an updated outline of the Movie Booking App, reflecting recent changes in models, URLs, and APIs. The goal is to ensure smooth functionality while keeping the codebase scalable and secure.
