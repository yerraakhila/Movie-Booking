import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getToken } from "../helper/user";

function ScreenSeating() {
  const [seats, setSeats] = useState([]);
  const { id, city } = useParams();
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/" + city + "/screening-seats/" + id + "/")
      .then((Response) => setSeats(Response.data))
      .catch((error) => console.log(error));
  }, [id, city]);

  const [screening, setScreening] = useState({});
  useEffect(() => {
    axios
      .get(
        "http://127.0.0.1:8000/api/" + city + "/single-screening/" + id + "/"
      )
      .then((Response) => setScreening(Response.data))
      .catch((error) => console.log(error));
  }, [id, city]);

  const navigate = useNavigate();
  function handleClick(e) {
    e.preventDefault();
    const seats_dict = {
      seats: newlyBookedSeats,
      screening: id,
    };
    console.log(seats_dict)
    const token = getToken();

    axios
      .post("http://127.0.0.1:8000/api/select-seats/", seats_dict, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;

        const booking_id = data.booking_id;
        console.log(response);
        navigate("/" + city + "/booking_details/" + booking_id);
      })
      .catch((error) => console.log(error));
  }

  function extractTime(dateTimeString) {
    const date = new Date(dateTimeString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, "0");
    return `${hours}:${formattedMinutes}${amPm}`;
  }

  const [newlyBookedSeats, setNewlyBookedSeats] = useState([]); // Manage booked seats state
    function handleSeatClick(seat) {
      if (seat.is_available) {
        setNewlyBookedSeats((prevSeats) => {
          const seatIndex = prevSeats.findIndex((s) => s.id === seat.id);
          if (seatIndex !== -1) {
            // Seat is already booked, remove it
            return prevSeats.filter((s) => s.id !== seat.id);
          } else {
            // Seat is not booked, add it
            return [...prevSeats, seat];
          }
        });
      }
    }


  function getSeatClassName(seat) {
    return `seat ${seat.is_premium ? "premium" : "regular"} ${
      newlyBookedSeats.some((s) => s.id === seat.id) ? "selected" : ""
    } ${seat.is_available ? "" : "booked"}`;
  }
  return (
    <div className="seating-background">
      <div className="seating-info">
        {screening.movie_object ? (
          <div className="title-time">
            <h1>{screening.movie_object.title}</h1>
            <h4>
              {screening.theatre_object.name},{" "}
              {screening.theatre_object.address}
            </h4>
            <h4>{extractTime(screening.date_time)}</h4>
          </div>
        ) : (
          <p>Loading movie details...</p>
        )}

        <div className="seating-border">
          <div className="seat-container">
            {seats.length > 0 ? (
              seats.map((seat) => (
                <div
                  key={seat.id}
                  onClick={() => handleSeatClick(seat)}
                  className={getSeatClassName(seat)}
                >
                  {seat.row}
                  {seat.number}
                </div>
              ))
            ) : (
              <p>Loading seats...</p>
            )}
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
