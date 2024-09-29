import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../helper/user";

function BookingDetail() {
  const { id, city } = useParams();
  const [booking, setBooking] = useState({});
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
      .then((Response) => setBooking(Response.data))
      .catch((error) => console.log(error));
  }, [id]);

  const navigate = useNavigate();
  function handleClick(e) {
    e.preventDefault();
    console.log("akhila");
    const token = getToken();
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
        console.log(response);
        navigate("/" + city + "/booking_confirmation/" + booking_id);
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
  function extractDayMonth(dateTimeString) {
    const date = new Date(dateTimeString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });

    // Adding the appropriate suffix (st, nd, rd, th) to the day
    const daySuffix = (day) => {
      if (day > 3 && day < 21) return "th"; // Covers 11th to 20th
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${daySuffix(day)} ${month}`;
  }

  // let premium = 0;
  // let regular = 0;
  // let convenience = 0;

  // if (booking && booking.seats) {
  //   premium = booking.seats.filter((seat) => seat.is_premium).length * 500;
  //   regular = booking.seats.filter((seat) => !seat.is_premium).length * 300;
  //   convenience = booking.seats.length * 50;
  // }
  // let sub_total = premium + regular + convenience;
  // let gst = sub_total * 0.18;
  // let total = sub_total * 1.18;
  let premium = 0;
  let regular = 0;
  let gst = 0;
  let sub_total = 0;
  let convenience = 0;
  let total = 0;
  if (booking && booking.seats) {
    premium = booking.seats.filter((seat) => seat.is_premium).length * 500;
    regular = booking.seats.filter((seat) => !seat.is_premium).length * 300;
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
              <h5>{extractTime(booking.screening_object.date_time)}</h5>
              <h5>{extractDayMonth(booking.screening_object.date_time)}</h5>
              <h5>
                {booking.seats
                  .map((seat) => `${seat.row}${seat.number}`)
                  .join(", ")}
              </h5>
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
        <button className="pay-button" onClick={handleClick}>
          Click here to Pay
        </button>
      </div>
    </div>
  );
}
export default BookingDetail;
