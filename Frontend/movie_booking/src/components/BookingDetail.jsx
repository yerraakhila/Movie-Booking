import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../helper/user";
import { formatDateTime } from "../helper/dateHelper";

function BookingDetail() {
  const { id, city } = useParams();
  const [booking, setBooking] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const token = getToken();

  useEffect(() => {
    axios
      .get(
        "http://127.0.0.1:8000/api/" + city + "/booking-detail/" + id + "/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((Response) => {
        setBooking(Response.data);

        // Get the createdAt time from the backend response
        const createdAt = new Date(Response.data.created_at);
        const currentTime = new Date();

        // Calculate the time difference in seconds
        const timeElapsed = Math.floor((currentTime - createdAt) / 1000);
        const remainingTime = Math.max(60 - timeElapsed, 0); // 180 seconds minus elapsed time

        setTimeLeft(remainingTime);
      })
      .catch((error) => console.log(error));
  }, [id, city, token]);

  const navigate = useNavigate();

  function handleClick(e) {
    e.preventDefault();
    if (timeLeft > 0) {
      axios
        .put(
          "http://127.0.0.1:8000/api/booking-pay/" + id + "/",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const data = response.data;
          const booking_id = data.booking_id;
          navigate("/" + city + "/booking_confirmation/" + booking_id);
        })
        .catch((error) => console.log(error));
    }
  }

  // Timer effect
  useEffect(() => {
    if (timeLeft === 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Format time as mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  let premium = 0;
  let regular = 0;
  let gst = 0;
  let sub_total = 0;
  let convenience = 0;
  let total = 0;
  if (booking && booking.seats) {
    premium = booking.seats
      .filter((seat) => seat.is_premium)
      .reduce((total, seat) => total + seat.cost, 0);

    regular = booking.seats
      .filter((seat) => !seat.is_premium)
      .reduce((total, seat) => total + seat.cost, 0);

    gst = (premium + regular) * 0.18;
    sub_total = premium + regular + gst;
    convenience = 50;
    total = sub_total + convenience;
  }

  return (
    <div className="booking-detail-background">
      <div className="booking-details">
        <div className="booking-with-heading">
          <h2>Booking Details:</h2>
          <br></br>
          <br></br>
          {booking &&
          booking.screening_object &&
          booking.screening_object.movie_object &&
          booking.screening_object.date_time ? (
            <div className="booking-with-img">
              <div className="basic-details">
                <h4>{booking.screening_object.movie_object.title}</h4>
                <h5>{booking.screening_object.movie_object.languages}</h5>
                <h5>{booking.screening_object.movie_object.genre}</h5>
                <h5>{booking.screening_object.theatre_object.name}</h5>
                <h5>{booking.screening_object.theatre_object.address}</h5>
                <h5>{formatDateTime(booking.screening_object.date_time)}</h5>
              </div>

              <div>
                <img
                  src={booking.screening_object.movie_object.poster_url}
                  width={105}
                  height={150}
                ></img>
              </div>
            </div>
          ) : (
            <p>Loading booking details...</p>
          )}
        </div>

        <div className="payment-box">
          <h3 className="order-summary">Order Summary:</h3>
          <br></br>

          <div>
            {booking && booking.seats && booking.seats.length > 0 ? (
              <div>
                {/* Premium Seats */}
                {booking.seats.filter((seat) => seat.is_premium).length > 0 && (
                  <div className="pay-parallel">
                    <div>
                      Premium Seats:{" "}
                      {booking.seats
                        .filter((seat) => seat.is_premium)
                        .map((seat) => `${seat.row}${seat.number}`)
                        .join(", ")}{" "}
                      ({booking.seats.filter((seat) => seat.is_premium).length}{" "}
                      {booking.seats.filter((seat) => seat.is_premium)
                        .length === 1
                        ? "Ticket"
                        : "Tickets"}
                      )
                    </div>
                    <div>₹{premium}</div>
                  </div>
                )}

                {/* Regular Seats */}
                {booking.seats.filter((seat) => !seat.is_premium).length >
                  0 && (
                  <div className="pay-parallel">
                    <div>
                      Regular Seats:{" "}
                      {booking.seats
                        .filter((seat) => !seat.is_premium)
                        .map((seat) => `${seat.row}${seat.number}`)
                        .join(", ")}{" "}
                      ({booking.seats.filter((seat) => !seat.is_premium).length}{" "}
                      {booking.seats.filter((seat) => !seat.is_premium)
                        .length === 1
                        ? "Ticket"
                        : "Tickets"}
                      )
                    </div>
                    <div>₹{regular}</div>
                  </div>
                )}
              </div>
            ) : (
              <p>Loading booking details...</p>
            )}

            <div className="pay-parallel">
              <div>GST fee (18%)</div>
              <div>₹{gst}</div>
            </div>
            <hr />
            <div className="pay-parallel">
              <div className="sub-total">Sub total</div>
              <div className="sub-total">₹{sub_total}</div>
            </div>
            <div className="pay-parallel">
              <div>Convenience fee</div>
              <div>₹{convenience}</div>
            </div>
            <hr />
            <div className="pay-parallel">
              <div className="total">Total</div>
              <div className="total">₹{total}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h6>Time left to pay: {formatTime(timeLeft)}</h6>
        <button
          className="pay-button"
          onClick={handleClick}
          disabled={timeLeft === 0}
        >
          {timeLeft > 0 ? "Click here to Pay" : "Time expired"}
        </button>
      </div>
    </div>
  );
}

export default BookingDetail;
