import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getToken } from "../helper/user";

function ScreenSeating() {
  const [seats, setSeats] = useState([]);
  const { id, city } = useParams();
  const [screening, setScreening] = useState({});
  const [newlyBookedSeats, setNewlyBookedSeats] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication and redirect to login if not authenticated
  useEffect(() => {
    const token = getToken();
    if (!token) {
      // If no token, redirect to login and pass current path in state for redirect after login
      navigate("/signin", { state: { redirectTo: location.pathname } });
    }
  }, [navigate, location]);

  // Fetch seats
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/${city}/screening-seats/${id}/`)
      .then((response) => setSeats(response.data))
      .catch((error) => console.log(error));
  }, [id, city]);

  // Fetch screening details
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/${city}/single-screening/${id}/`)
      .then((response) => setScreening(response.data))
      .catch((error) => console.log(error));
  }, [id, city]);

  // Handle seat click
  function handleSeatClick(seat) {
    if (seat.is_available) {
      setNewlyBookedSeats((prevSeats) => {
        const seatIndex = prevSeats.findIndex((s) => s.id === seat.id);
        if (seatIndex !== -1) {
          // Remove seat if already selected
          return prevSeats.filter((s) => s.id !== seat.id);
        } else {
          // Add seat if not selected
          return [...prevSeats, seat];
        }
      });
    }
  }

  // Get seat class for styling
  function getSeatClassName(seat) {
    return `seat ${seat.is_premium ? "premium" : "regular"} ${
      newlyBookedSeats.some((s) => s.id === seat.id) ? "selected" : ""
    } ${seat.is_available ? "" : "booked"}`;
  }

  // Extract and format time from date string
  function extractTime(dateTimeString) {
    const date = new Date(dateTimeString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, "0");
    return `${hours}:${formattedMinutes}${amPm}`;
  }

  // Handle continue button click
  function handleClick(e) {
    e.preventDefault();

    // Check if any seats have been selected
    if (newlyBookedSeats.length === 0) {
      alert("Please select at least one seat before proceeding.");
      return;
    }

    const seats_dict = {
      seats: newlyBookedSeats,
      screening: id,
    };

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
        navigate(`/${city}/booking_details/${booking_id}`);
      })
      .catch((error) => console.log(error));
  }

  function extractDayMonth(dateTimeString) {
    const date = new Date(dateTimeString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
  
    // Adding the appropriate suffix (st, nd, rd, th) to the day
    const daySuffix = (day) => {
      if (day > 3 && day < 21) return 'th'; // Covers 11th to 20th
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
  
    return `${day}${daySuffix(day)} ${month}`;
  }
  

  return (
    <div className="seating-background">
      <div className="seating-info">
        {screening.movie_object ? (
          <div className="title-time">
            <h2>{screening.movie_object.title}</h2>
            <h5>
              {screening.theatre_object.name},{" "}
              {screening.theatre_object.address}{" "}-{" "}
              {extractDayMonth(screening.date_time)},{" "}
              {extractTime(screening.date_time)}
            </h5>
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
          <img src="https://assetscdn1.paytm.com/movies_new/_next/static/media/screen-icon.8dd7f126.svg" alt="Screen Icon" style={{ transform: "scale(0.80)" }} />
        </div>

        <div>
          <button
            className={`continue ${newlyBookedSeats.length === 0 ? "disable" : ""}`}
            onClick={handleClick}
            disabled={newlyBookedSeats.length === 0}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScreenSeating;
