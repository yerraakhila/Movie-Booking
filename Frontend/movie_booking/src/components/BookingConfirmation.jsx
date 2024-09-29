import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../helper/user";
import { Link } from "react-router-dom";

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
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  }
  
  return (
    <div className="booking-confirmation-background">
      <div className="booking-confirmed-details">
        <h2>Booking done successfully</h2>
        {booking &&
        booking.screening_object &&
        booking.screening_object.movie_object &&
        booking.screening_object.date_time ? (
          <div>
            <br></br>
            <h4>
              {booking.screening_object.movie_object.title} (
              {booking.screening_object.movie_object.languages})
            </h4>
            <h5>{booking.screening_object.movie_object.genre}</h5>
            <h5>
              {booking.screening_object.theatre_object.name},
              {booking.screening_object.theatre_object.address}
            </h5>
            <h5>{extractTime(booking.screening_object.date_time)}</h5>
            <h5>{extractDate(booking.screening_object.date_time)}</h5>
            <h5>
              {booking.seats
                .map((seat) => `${seat.row}${seat.number}`)
                .join(", ")}
            </h5>
          </div>
        ) : (
          <p>Loading booking details...</p>
        )}
        <h5 className="text-center">
          Want to go to my bookings. Click <Link to="/my_bookings">here</Link>
           <br/>
           Want to go to home. Click <Link to="/">here.</Link>
        </h5>
      </div>
    </div>
  );
}
export default BookingConfirmation;
