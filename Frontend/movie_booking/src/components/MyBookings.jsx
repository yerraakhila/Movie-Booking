import axios from "axios";
import { useEffect, useState } from "react";
import { getToken, getCity } from "../helper/user";
import { calculateTotal } from "../helper/bookingHelper";
import { formatDateTime } from "../helper/dateHelper";
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
    const city = getCity();
    navigate(`/${city}/booking_confirmation/${bookingId}`);
  };

  return (
    <div className="my-bookings-background">
      <div className="my-bookings-details">
        <div className="bookings-title">
          <h2>My Bookings</h2>
          <hr></hr>
        </div>

        <div className="bookings-column">
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.booking_id}
                className="booking-row"
                onClick={() => handleNavigate(booking.booking_id)}
              >
                <div className="poster-title">
                  <img
                    src={booking.screening_object.movie_object.poster_url}
                    alt={booking.screening_object.movie_object.title}
                    style={{ width: "70px", height: "100px" }}
                  />
                  <div>
                    <h5>{booking.screening_object.movie_object.title}</h5>
                    <h5 className="title-date">
                      {formatDateTime(booking.screening_object.date_time)}
                    </h5>
                  </div>
                </div>
                <h5>{booking.status}</h5>
                <h5>₹ {calculateTotal(booking)}</h5>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
