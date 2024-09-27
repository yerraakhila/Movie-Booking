import axios from "axios";
import { useEffect, useState } from "react";
import { getToken } from "../helper/user";
import { Link } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const token = getToken();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/my-bookings/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((Response) => setBookings(Response.data))
      .catch((error) => console.log(error));
  }, []);
  return (
    <div className="my-bookings-background">
      <div className="my-bookings-details">
        <h2>Bookings</h2>
      {bookings.map((booking) => (
        <div key={booking.booking_id}>{booking.booking_id}<hr></hr></div>
      ))}
      <h5> Want to go to home. Click <Link to="/">here.</Link></h5>
      <h5> Want to go to your profile. Click <Link to="/user_profile">here.</Link></h5>
      </div>

      
    </div>
  );
}
export default MyBookings;
