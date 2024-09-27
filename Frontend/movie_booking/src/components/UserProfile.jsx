import axios from "axios";
import { useEffect, useState } from "react";
import { getToken } from "../helper/user";
import { Link } from "react-router-dom";

function UserProfile() {
  const [userData, setUserData] = useState({});
  const token = getToken();
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/user-profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((Response) => setUserData(Response.data))
      .catch((error) => console.log(error));
  }, []);
  return (
    <div className="user-profile-background">
      <div className="user-profile-details">
        <h4>
          <Link to="/">Edit</Link>
        </h4>
        <div className="user-sub-div">
          <h2>{userData.name}</h2>
          <h2>{userData.username}</h2>
          <h2>{userData.email}</h2>
        </div>
      </div>
    </div>
  );
}
export default UserProfile;
