import { useNavigate } from "react-router-dom";
import { CiStar } from "react-icons/ci";

function EachScreening(props) {
  let navigate = useNavigate();
  const { id, theatre, date_time } = props.data;
  const time = new Date(date_time).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  function handleClick(e) {
    e.preventDefault();
    navigate("/ScreenSeatingPage/" + id);
  }

  return (
    <div className="each-screen">
      <div className="left-theater-details">
        <div className="theatre-star">
          <CiStar size={20} />
          <h5 className="theatre-name">Apsara Theatre</h5>
        </div>
        <div>
          <p className="area">Whitefield</p>
        </div>
      </div>
      <div>
        <button className="time" onClick={handleClick}>
          {time}
        </button>
      </div>
    </div>
  );
}
export default EachScreening;
