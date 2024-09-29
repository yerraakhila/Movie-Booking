import axios from "axios";
import { useEffect, useState } from "react";
import { getToken } from "../helper/user";
import { Link, useNavigate } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/my-bookings/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => setBookings(response.data))
      .catch((error) => console.log(error));
  }, [token]);

  const handleNavigate = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

  return (
    <div className="my-bookings-background">
      <div className="my-bookings-details">
        <h2>Bookings</h2>
        { bookings.length === 0 ? (
          <p>No bookings found.</p>  
        ) : bookings.map((booking) => (
          <div key={booking.booking_id} className="booking-row">
            {/* First column: Movie poster */}
            <div className="booking-poster">
              <img
                src={booking.screening_object.movie_object.poster_url}
                alt={booking.screening_object.movie_object.title}
                style={{ width: "100px", height: "150px" }}
              />
            </div>

            {/* Second column: Movie details, theatre name, and screening time */}
            <div className="booking-details">
              <h4>{booking.screening_object.movie_object.title}</h4>
              <p>
                <strong>Theatre:</strong>{" "}
                {booking.screening_object.theatre_object.name},{" "}
                {booking.screening_object.theatre_object.address}
              </p>
              <p>
                <strong>Screening Time:</strong>{" "}
                {new Date(booking.screening_object.date_time).toLocaleString()}
              </p>
            </div>

            {/* Third column: Arrow for navigation */}
            <div
              className="booking-navigate"
              onClick={() => handleNavigate(booking.booking_id)}
              style={{ cursor: "pointer" }}
            >
              ➡️
            </div>

            <hr />
          </div>
        ))}
        <h5>
          Want to go to home? Click <Link to="/">here.</Link>
        </h5>
        <h5>
          Want to go to your profile? Click{" "}
          <Link to="/user_profile">here.</Link>
        </h5>
      </div>
    </div>
  );
}

export default MyBookings;
