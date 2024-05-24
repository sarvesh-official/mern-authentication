import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("https://mern-authentication-backend-psi.vercel.app/auth/verify")
      .then((res) => {
        if (res.data.status) {
          console.log(res);
        } else {
          navigate("/");
        }
      });
  });
  return <div>Dashboard</div>;
};

export default Dashboard;
