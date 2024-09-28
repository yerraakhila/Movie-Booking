# Movie Booking App

## Overview

The Movie Booking App is designed to provide users with a seamless experience for discovering, booking, and managing movie tickets. Users can explore the latest movies, view showtimes, and book tickets at their convenience.

## Requirements

### User Registration and Profile Management
- Users can create accounts using email or social media.
- Profile management includes viewing past bookings and preferences.

### Movie Discovery
- Browse movies by genre, release date, and popularity.
- Detailed movie pages featuring synopses, trailers, cast information, and reviews.

### Showtime and Seat Selection
- Real-time availability of showtimes for various cinemas.
- Interactive seat selection interface with color-coded options.

### Payment Processing
- Order summary and ticket confirmation post-payment.

### Admin Dashboard
- Management interface for cinema owners to update movie listings, manage showtimes, and view sales analytics.

## Design

### User Flow
- **Frontend URLs**
  - `/city/`
  - `/city/movie/<id>`
  - `/city/theatre/<id>` (Optional)
  - `/city/movie/<id>/screenings`
  - `/city/movie/<id>/screening/<id>/seats`
  - `/city/movie/<id>/screening/<id>/booking_details/<id>` (Booking is in pending state here)
  - `/profile`
  - `/bookings`
  - `/booking/<id>`

## Backend Models

### Movie
- `Title`
- `Description`
- `Rating`
- `Review`
- `Genre`
- `Languages`
- `Release date`
- `Running time`
- `trailer_url`

### Theatre
- `Name`
- `Address`
- `City`

### Screening
- `Theatre`
- `Movie`
- `Date and time`

### Seat
- `Row`
- `Number`
- `IsPremium`
- `IsBooked`
- `Cost`

### Booking
- `User`
- `Movie`
- `Theatre`
- `Screening`
- `Seats`

### User/Profile
- `Username`
- `Password`
- `Name`
- `Email`

## Backend APIs

### User APIs

#### User Registration
```http
POST /api/signup
{
  "username": "string",
  "password": "string",
  "email": "string",
  "name": "string"
}
