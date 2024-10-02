import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import SignUp from "./pages/SignUpPage/SignUp.jsx";
import SignIn from "./pages/SignInPage/SignIn.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/LandingPage/HomePage.jsx";
import MovieDetailPage from "./pages/MovieDetailPage/MovieDetailPage.jsx";
import MovieScreeningsPage from "./pages/MovieScreeningsPage/MovieScreeningsPage.jsx";
import ScreeningSeatingPage from "./pages/ScreeningSeatingPage/ScreeningSeatingPage.jsx";
import BookingDetailPage from "./pages/BookingDetailPage/BookingDetailPage.jsx";
import BookingConfirmedPage from "./pages/BookingConfirmedPage/BookingConfirmedPage.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import MyBookingsPage from "./pages/MyBookings/MyBookingsPage.jsx";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage.jsx";
import ChangePasswordPage from "./pages/UserProfilePage/ChangePasswordPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:city" element={<LandingPage />} />
        <Route path="/:city/movie/:id" element={<MovieDetailPage />} />
        <Route
          path="/:city/movie_screenings/:id/:date"
          element={<MovieScreeningsPage />}
        />
        <Route
          path="/:city/screening_seats/:id/"
          element={<ScreeningSeatingPage />}
        />
        <Route
          path="/:city/booking_details/:id"
          element={<BookingDetailPage />}
        />
        <Route
          path="/:city/booking_confirmation/:id"
          element={<BookingConfirmedPage />}
        />
        <Route path="/my_bookings" element={<MyBookingsPage />} />
        <Route path="/user_profile" element={<UserProfilePage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
