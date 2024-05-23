import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Home = () => {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const handleLogOut = () => {
    Cookies.remove("token", { path: "/" });
    navigate("/login");
  };
  return (
    <div className="flex flex-col gap-10 items-center justify-center mt-36">
      <Link to={"/dashboard"}>
        <button className="bg-blue-500 p-4 rounded-md text-2xl font-semibold hover:bg-blue-400">
          Dashboard
        </button>
      </Link>
      <button
        onClick={handleLogOut}
        className="bg-blue-500 p-4 rounded-md text-2xl font-semibold hover:bg-blue-400"
      >
        Log Out
      </button>
    </div>
  );
};

export default Home;
