import AllMovies from "../../components/AllMovies";
import Navbar from "../../components/Navbar";
import { useParams } from "react-router-dom";

function LandingPage() {
  const { city } = useParams(); // Access the city from the URL

  return (
    <div>
      <Navbar />
      <AllMovies city={city} />
    </div>
  );
}
export default LandingPage;
