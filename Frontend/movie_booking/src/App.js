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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/movieDetailPage/:id" element={<MovieDetailPage />} />
        <Route
          path="/movieScreeningsPage/:id"
          element={<MovieScreeningsPage />}
        />
        <Route
          path="/screenSeatingPage/:id"
          element={<ScreeningSeatingPage />}
        />
        <Route path="/bookingDetailPage/:id" element={<BookingDetailPage />} />
        <Route
          path="/bookingConfirmedPage/:id"
          element={<BookingConfirmedPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
