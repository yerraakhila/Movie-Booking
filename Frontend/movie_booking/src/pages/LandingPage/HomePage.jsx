import { useNavigate } from "react-router-dom";
import { getCity } from "../../helper/user";
import { useEffect } from "react";

function HomePage() {
  let navigate = useNavigate()
  useEffect(() => {
    const city = getCity(); // Get the city
    navigate("/movies/" + city); // Navigate to the city route
  }, [navigate]); 
  return <></>;
}
export default HomePage;
