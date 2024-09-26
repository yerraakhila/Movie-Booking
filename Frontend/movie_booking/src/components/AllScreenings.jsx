import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EachScreening from "./EachScreening";
import { FaLessThan } from "react-icons/fa6";
import { FaGreaterThan } from "react-icons/fa6";

function AllScreenings() {
  const { id, date, city } = useParams();
  const [screenings, setScreenings] = useState([]);
  const [theatreScreenings, settheatreScreenings] = useState([]);
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
      .then((Response) => setScreenings(Response.data))
      .catch((error) => console.log(error));
  }, [city,id,date]);
  console.log(screenings);
  function getNextFiveDaysFromToday() {
    const daysArray = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(); // Create a date object for today
      date.setDate(date.getDate() + i); // Increment by i days

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`; // Return the formatted date
    });

    return daysArray;
  }

  const datesArray = getNextFiveDaysFromToday();
  let navigate = useNavigate();
  function handleClick(e, selectedDate) {
    e.preventDefault();
    navigate("/" + city + "/movie_screenings/" + id + "/" + selectedDate);
  }

  useEffect(() => {
    // Group screenings by theatre with the desired output structure
    const groupedByTheatre = screenings.reduce((acc, screening) => {
      const theatreId = screening.theatre;
      const theatreInfo = screening.theatre_object;

      if (!acc[theatreId]) {
        acc[theatreId] = {
          theatre_id: theatreId, // Include the theatre ID
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

    // Convert the grouped object into an array
    const theatre_screenings_list = Object.values(groupedByTheatre);
    settheatreScreenings(theatre_screenings_list);
  }, [screenings]);

  return (
    <div className="all-screenings-background">
      <div className="screenings-border">
        <div className="dates">
          <FaLessThan className="than" size={27} />
          {datesArray.map((selectedDate, index) => (
            <button onClick={(e) => handleClick(e, selectedDate)} key={index}>
              {selectedDate}
            </button> // Create a button for each date
          ))}

          <FaGreaterThan className="than" size={27} />
        </div>
        <div className="column">
          {theatreScreenings.map((theatre_screenings) => (
            <EachScreening
              data={theatre_screenings}
              key={theatre_screenings.theatre_id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default AllScreenings;
