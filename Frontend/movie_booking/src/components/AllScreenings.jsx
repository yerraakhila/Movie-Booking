import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EachScreening from "./EachScreening";

function AllScreenings() {
  const { id, date, city } = useParams();
  const [screenings, setScreenings] = useState([]);
  const [theatreScreenings, setTheatreScreenings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(date); // Track the selected date

  useEffect(() => {
    axios
      .get(
        "http://127.0.0.1:8000/api/" +
          city +
          "/movie-screenings/" +
          id +
          "/" +
          date
      )
      .then((response) => setScreenings(response.data))
      .catch((error) => console.log(error));
  }, [city, id, date]);

  function getNextFiveDaysFromToday() {
    const daysArray = Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    });

    return daysArray;
  }

  const datesArray = getNextFiveDaysFromToday();
  let navigate = useNavigate();

  function handleClick(e, selectedDate) {
    e.preventDefault();
    setSelectedDate(selectedDate); // Update the selected date in state
    navigate("/" + city + "/movie_screenings/" + id + "/" + selectedDate);
  }

  useEffect(() => {
    const groupedByTheatre = screenings.reduce((acc, screening) => {
      const theatreId = screening.theatre;
      const theatreInfo = screening.theatre_object;

      if (!acc[theatreId]) {
        acc[theatreId] = {
          theatre_id: theatreId,
          theatre_name: theatreInfo.name,
          address: theatreInfo.address,
          screenings: [],
        };
      }

      acc[theatreId].screenings.push({
        id: screening.id,
        movie: screening.movie,
        date_time: screening.date_time,
      });

      return acc;
    }, {});

    const theatreScreeningsList = Object.values(groupedByTheatre);
    setTheatreScreenings(theatreScreeningsList);
  }, [screenings]);

  return (
    <div className="all-screenings-background">
      <div className="screenings-border">
        <div className="dates">
          {datesArray.map((dateOption, index) => (
            <button
              className="date-button"
              onClick={(e) => handleClick(e, dateOption)}
              key={index}
              style={{
                backgroundColor: selectedDate === dateOption ? "green" : "", // Change background if selected
                color: selectedDate === dateOption ? "white" : "",
              }}
            >
              {dateOption}
            </button>
          ))}
        </div>
        <div className="column column-screenings">
          {theatreScreenings.map((theatreScreening) => (
            <EachScreening
              data={theatreScreening}
              key={theatreScreening.theatre_id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllScreenings;
