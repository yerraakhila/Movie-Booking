import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../helper/user";

function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState({});
  const token = getToken();
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/booking-detail/" + id + "/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((Response) => setBooking(Response.data))
      .catch((error) => console.log(error));
  }, [id]);
  // console.log(booking.screening)
  // console.log("hi")
  // const seats = booking.seat_objects
  // console.log(seats)
  // const seatList = seats.map(seat => `${seat.row}${seat.number}`);
  const navigate = useNavigate()
  function handleClick(e){
    e.preventDefault();
    navigate("/bookingConfirmedPage/" + id);
  }
  

  return (
    <div className="booking-detail-background">
      <div className="booking-details">
        <h2>Booking Summary</h2>
        {/* <h3>{seatList}</h3> */}
      </div>
      <div>
        <button onClick={handleClick}>click here to Pay</button>
      </div>
    </div>
  );
}
export default BookingDetail;
