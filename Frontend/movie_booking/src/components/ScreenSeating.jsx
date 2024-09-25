import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { getToken } from "../helper/user";

function ScreenSeating() {
  const [seats, setSeats] = useState([]);
  const [newlyBookedSeats, setNewlyBookedSeats] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/screening-seats/" + id + "/")
      .then((Response) => setSeats(Response.data))
      .catch((error) => console.log(error));
  }, []);
  const handleSeatClick = (id, is_booked) => {
    const updatedSeats = seats.map((seat) =>
      seat.id === id ? { ...seat, is_booked: !seat.is_booked } : seat
    );
    setSeats(updatedSeats);
    if (!is_booked) {
      setNewlyBookedSeats([...newlyBookedSeats, id]); // Add to newly booked
    } else {
      setNewlyBookedSeats(newlyBookedSeats.filter((seatId) => seatId !== id)); // Remove if unbooked
    }
  };
  const navigate = useNavigate();
  function handleClick(e) {
    e.preventDefault();

    const seats_dict = { seats: newlyBookedSeats, screening: id };

    const token = getToken();
    axios
      .post("http://127.0.0.1:8000/api/select-seats/", seats_dict, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(
        (response) => {
          const data = response.data;

          const booking_id = data.booking_id;
          console.log(response);
          navigate("/bookingDetailPage/" + booking_id);
        },
        (error) => {
          console.log(error);
        }
      )
      .catch((error) => console.log(error));
  }
  return (
    <div className="seating-background">
      <div className="seating-info">
        <div className="title-time">
          <h1>Tumbad</h1>
          <h4>11:00 PM</h4>
        </div>
        <div className="seating-border">
          <div className="seat-container">
            {seats.map((seat) => (
              <div
                key={seat.id}
                className={`seat ${seat.is_premium ? "premium" : "regular"} ${
                  seat.is_booked ? "booked" : ""
                }`}
                onClick={() => handleSeatClick(seat.id)}
              >
                {seat.row}
                {seat.number}
              </div>
            ))}
          </div>
        </div>

        <div>
          <button className="continue" onClick={handleClick}>
            continue
          </button>
        </div>
      </div>
    </div>
  );
}
export default ScreenSeating;
