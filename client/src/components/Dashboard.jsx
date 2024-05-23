import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://localhost:5000/auth/verify").then((res) => {
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
