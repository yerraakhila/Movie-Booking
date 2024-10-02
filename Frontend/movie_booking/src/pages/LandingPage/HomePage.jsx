import { useNavigate } from "react-router-dom";
import { getCity } from "../../helper/user";
import { useEffect } from "react";

function HomePage() {
  let navigate = useNavigate()
  useEffect(() => {
    const city = getCity(); 
    navigate("/movies/" + city);
  }, [navigate]); 
  return <></>;
}
export default HomePage;
