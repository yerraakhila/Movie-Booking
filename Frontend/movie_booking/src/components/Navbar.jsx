import { useState, useEffect } from "react"; // Import useEffect for handling side effects
import { BiCameraMovie } from "react-icons/bi"; // Ensure you import this
import { CgProfile } from "react-icons/cg"; // Ensure you import this
import { useNavigate, useParams } from "react-router-dom";
import { setCity } from "../helper/user";
import axios from "axios";
import { Link } from "react-router-dom";
import { getUser, clearUser } from "../helper/user";

function Navbar() {
  const { city } = useParams();
  const [searchInput, setSearchInput] = useState(""); // State for search input
  const [searchResults, setSearchResults] = useState([]); // State for search results
  let navigate = useNavigate();
  let loginStatus = getUser() ? true : false;
  function handleLogout() {
    clearUser();
    localStorage.setItem("user");
  }

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setCity(selectedCity); // Save the selected city to local storage
    navigate("/movies/" + selectedCity); // Navigate to the new city route
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
    <div className="navbar">
      <div className="logo-with-appname" onClick={() => navigate("/")}>
        <BiCameraMovie size={40} />
        <span className="app-name">Book My Movie</span>
      </div>
      <div className="search-container" style={{ position: "relative" }}>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search for movies..."
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
                {movie.title}{" "}
                {
                  /* Adjust based on your movie object structure */
                  console.log(movie)
                }
              </div>
            ))}
          </div>
        )}
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
        {/* <div className="profile-div">
          <CgProfile size={40} />
          <span className="profile-span">Profile</span>
        </div> */}
        <div className="icon profile">
          <button
            className=""
            type="button"
            data-toggle="dropdown"
            aria-expanded="false"
            style={{
              backgroundColor: "rgb(249, 242, 235)",
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
            <div className="dropdown-menu">
              <Link className="dropdown-item" to="/signin">
                Login
              </Link>
              <Link className="dropdown-item" to="/signup">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="dropdown-menu">
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
          <div className="dropdown-menu">
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
          <p style={{ margin: "0px", fontWeight: "600" }}>Profile</p>
        </div>
      </div>
    </div>
  );
}
export default Navbar;
