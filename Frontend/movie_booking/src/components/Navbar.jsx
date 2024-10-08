import { useState, useEffect } from "react";
import { BiCameraMovie } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";
import { setCity } from "../helper/user";
import axios from "axios";
import { Link } from "react-router-dom";
import { getUser, clearUser } from "../helper/user";

function Navbar() {
  const { city } = useParams();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  let navigate = useNavigate();
  let loginStatus = getUser() ? true : false;
  function handleLogout() {
    clearUser();
    localStorage.setItem("user");
  }

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setCity(selectedCity);
    navigate("/movies/" + selectedCity);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchInput(value); // Update search input state
  };

  useEffect(() => {
    // Fetch search results if input length is 3 or more
    const fetchSearchResults = async () => {
      if (searchInput.length >= 3) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/movies-search?query=${searchInput}`
          );
          setSearchResults(response.data); // Update search results state
        } catch (error) {
          console.error("Error fetching search results:", error);
          setSearchResults([]); // Clear results on error
        }
      } else {
        setSearchResults([]); // Clear results if input is less than 3 characters
      }
    };

    fetchSearchResults(); // Call the function
  }, [searchInput]); // Dependency array to run effect when searchInput changes

  const handleResultClick = (movieId) => {
    navigate("/" + city + "/movie/" + movieId);
    setSearchInput("");
    setSearchResults([]);
  };

  return (
    <div
      className="navbar"
      style={{
        padding: "15px 25px",
      }}
    >
      <div className="logo-with-appname" onClick={() => navigate("/")}>
        <BiCameraMovie size={40} />
        <span className="app-name">bookmymovie</span>
      </div>
      <div
        className="search-container"
        style={{ position: "relative", width: "500px" }}
      >
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search for movies..."
          className="search-input"
        />
        {searchInput.length >= 3 && searchResults?.length === 0 && (
          <div className="no-results-message">No results found.</div>
        )}
        {searchResults?.length > 0 && (
          <div className="search-results-dropdown">
            {searchResults.map((movie) => (
              <div
                key={movie.id}
                className="search-result-item"
                onClick={() => handleResultClick(movie.id)}
              >
                {movie.title}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="city-and-profile">
        <div className="city-selection">
          <label htmlFor="cities" className="select-city"></label>
          <select
            id="cities"
            className="options"
            value={city}
            onChange={handleCityChange}
          >
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Mumbai">Mumbai</option>
          </select>
        </div>

        <div className="icon profile">
          <button
            className="profile-button"
            type="button"
            data-toggle="dropdown"
            aria-expanded="false"
            style={{
              color: "black",
              border: "0px",
            }}
          >
            {loginStatus ? (
              <span className="circle">
                {getUser().charAt(0).toUpperCase()}
              </span>
            ) : (
              <CgProfile size={30} />
            )}
          </button>
          {!loginStatus ? (
            <div className="dropdown-menu dropdown-menu-right">
              <Link className="dropdown-item" to="/signin">
                Login
              </Link>
              <Link className="dropdown-item" to="/signup">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="dropdown-menu dropdown-menu-right">
              <Link className="dropdown-item" onClick={handleLogout} to="/">
                Logout
              </Link>
              <Link className="dropdown-item" to="/my_bookings">
                My bookings
              </Link>
              <Link className="dropdown-item" to="/user_profile">
                User Profile
              </Link>
            </div>
          )}
          <p style={{ margin: "0px", fontWeight: "600" }}>Profile</p>
        </div>
      </div>
    </div>
  );
}
export default Navbar;
