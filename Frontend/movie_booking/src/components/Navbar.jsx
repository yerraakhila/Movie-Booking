import { CgProfile } from "react-icons/cg";
import { BiCameraMovie } from "react-icons/bi";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <div className="logo-with-appname">
        <BiCameraMovie size={40} />
        <span className="app-name">Book My Movie</span>
      </div>
      <div className="city-and-profile">
        <div className="city-selection">
          <label htmlFor="cities" className="select-city">Select City:</label>
          <select id="cities" className="options">
            <option value="bangalore">Bangalore</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="mumbai">Mumbai</option>
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
