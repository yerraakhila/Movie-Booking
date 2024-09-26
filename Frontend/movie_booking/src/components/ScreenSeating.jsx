import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { getToken } from "../helper/user";

function ScreenSeating() {
  const [seats, setSeats] = useState([]);
  const [newlyBookedSeats, setNewlyBookedSeats] = useState([]);
  const { id, city } = useParams();
  const [screening, setScreening] = useState({});
  

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/" + city + "/screening-seats/" + id + "/")
      .then((Response) => setSeats(Response.data))
      .catch((error) => console.log(error));
  }, [id]);
  

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
  useEffect(() => {
    axios
      .get(
        "http://127.0.0.1:8000/api/" + city + "/single-screening/" + id + "/"
      )
      .then((Response) => setScreening(Response.data))
      .catch((error) => console.log(error));
  }, [id]);

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

  function extractTime(dateTimeString) {
    // Create a Date object from the input string
    const date = new Date(dateTimeString);

    // Extract the hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM or PM suffix
    const amPm = hours >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight

    // Format minutes to ensure two digits
    const formattedMinutes = String(minutes).padStart(2, "0");

    // Return the formatted time string
    return `${hours}:${formattedMinutes}${amPm}`;
  }
  return (
    <div className="seating-background">
      <div className="seating-info">
        <div className="title-time">
        <h1>{screening.movie_object.title}</h1>
          <h4>
            {screening.theatre_object.name}, {screening.theatre_object.address}
          </h4>
          <h4>{extractTime(screening.date_time)}</h4>
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
