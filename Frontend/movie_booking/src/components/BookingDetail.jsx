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
    console.log("akhila")
    const token = getToken();
    axios
      .put("http://127.0.0.1:8000/api/booking-pay/"+id+"/", {},{
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
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

  let premium = 0;
  let regular = 0;
  let convenience = 0;

  if (booking && booking.seats) {
    premium = booking.seats.filter((seat) => seat.is_premium).length * 500;
    regular = booking.seats.filter((seat) => !seat.is_premium).length * 300;
    convenience = booking.seats.length * 50;
  }
  let sub_total = premium + regular + convenience;
  let gst = sub_total * 0.18;
  let total = sub_total * 1.18;
  return (
    <div className="booking-detail-background">
      <div className="booking-details">
        <div>
          <h2>Booking Details:</h2>
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
              <h5>
                {booking.seats
                  .map((seat) => `${seat.row}${seat.number}`)
                  .join(", ")}
              </h5>
            </div>
          ) : (
            <p>Loading booking details...</p>
          )}
        </div>
        <div className="payment-box">
          <h3>Order Summary:</h3>
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
              <div>Convinience fee</div>
              <div>₹{convenience}</div>
            </div>
            <hr />
            <div className="pay-parallel">
              <div>Sub total</div>
              <div>₹{sub_total}</div>
            </div>
            <div className="pay-parallel">
              <div>GST fee</div>
              <div>₹{gst}</div>
            </div>
            <hr />
            <div className="pay-parallel">
              <div>Total</div>
              <div>₹{total}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <button onClick={handleClick}>click here to Pay</button>
      </div>
    </div>
  );
}
export default BookingDetail;
