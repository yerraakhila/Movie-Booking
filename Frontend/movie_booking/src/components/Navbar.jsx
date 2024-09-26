import { BiCameraMovie } from "react-icons/bi"; // Ensure you import this
import { CgProfile } from "react-icons/cg"; // Ensure you import this
import { useNavigate, useParams } from "react-router-dom";
import { setCity } from "../helper/user";

function Navbar() {
  const { city } = useParams();
  let navigate = useNavigate();

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setCity(selectedCity); // Save the selected city to local storage
    navigate("/movies/" + selectedCity); // Navigate to the new city route
  };

  return (
    <div className="navbar">
      <div className="logo-with-appname">
        <BiCameraMovie size={40} />
        <span className="app-name">Book My Movie</span>
      </div>
      <div className="city-and-profile">
        <div className="city-selection">
          <label htmlFor="cities" className="select-city">
            Select City:
          </label>
          <select
            id="cities"
            className="options"
            value={city} // Set the value to the current city
            onChange={handleCityChange} // Call the handler on change
          >
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Mumbai">Mumbai</option>
          </select>
        </div>
        <div className="profile-div">
          <CgProfile size={40} />
          <span className="profile-span">Profile</span>
        </div>
      </div>
    </div>
  );
}
export default Navbar;
