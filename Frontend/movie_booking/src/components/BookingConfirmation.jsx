import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../helper/user";
import { Link } from "react-router-dom";
import { TiTick } from "react-icons/ti";

function BookingConfirmation() {
  const { id, city } = useParams();
  const [booking, setBooking] = useState({});
  const token = getToken();

  useEffect(() => {
    axios
      .get(
        "http://127.0.0.1:8000/api/" +
          city +
          "/booking-confirmed-detail/" +
          id +
          "/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((Response) => setBooking(Response.data))
      .catch((error) => console.log(error));
  }, [id]);

  function extractTime(dateTimeString) {
    const date = new Date(dateTimeString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, "0");
    return `${hours}:${formattedMinutes}${amPm}`;
  }

  function extractDate(dateTimeString) {
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function calculateSeatCost() {
    return booking.seats
      ? booking.seats.reduce((acc, seat) => acc + seat.cost, 0)
      : 0;
  }

  function calculateTotal() {
    const seats_cost = calculateSeatCost();
    const gst = seats_cost * 0.18;
    const convenience = 50;
    return seats_cost + gst + convenience;
  }

  return (
    <div className="booking-confirmation-background">
      <div className="booking-confirmed-details">
        <div className="confirmed-heading">
          <div className="booking-tick">
            <h2 className="booking-confirmed">
              Booking confirmed successfully
            </h2>

            <TiTick className="tick" size={25} />
          </div>
        </div>
        {booking &&
        booking.screening_object &&
        booking.screening_object.movie_object &&
        booking.screening_object.date_time ? (
          <div className="confirmed-details">
            <img
              src={booking.screening_object.movie_object.poster_url}
              width="280"
              height={400}
              alt="Movie Poster"
            />
            <div>
              <h2>
                {booking.screening_object.movie_object.title} (
                {booking.screening_object.movie_object.languages})
              </h2>
              <h5>{booking.screening_object.movie_object.genre}</h5>
              <br></br>
              <h5>
                {booking.screening_object.theatre_object.name},{" "}
                {booking.screening_object.theatre_object.address}
              </h5>
              <h5>{extractTime(booking.screening_object.date_time)}</h5>
              <h5>{extractDate(booking.screening_object.date_time)}</h5>
              <h5>
                {booking.seats
                  .map((seat) => `${seat.row}${seat.number}`)
                  .join(", ")}
              </h5>
              <h5>Price: ₹{calculateTotal().toFixed(2)}</h5>
            </div>
          </div>
        ) : (
          <p>Loading booking details...</p>
        )}

        <h5 className="text-center">
          See all your bookings <Link to="/my_bookings">here</Link>.
        </h5>
      </div>
    </div>
  );
}

export default BookingConfirmation;
