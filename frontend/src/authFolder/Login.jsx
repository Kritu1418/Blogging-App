import React, { useState } from "react";
import "../App.css";
import './auth.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "https://blogging-app-d14y.onrender.com"; // 🔥 Backend Render URL

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });

      if (response.status === 200) {
        toast.success(response.data.message);

        setEmail("");
        setPassword("");

        setTimeout(() => {
          navigate("/homeblog");
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unknown error occurred!";
      toast.error(errorMessage);

      if (error.response?.data?.redirect) {
        navigate(error.response.data.redirect);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <ToastContainer position="top-center" autoClose={1500} transition={Bounce} theme="colored" />
      <div className="container">
        <form>
          <img src="./login-pana.svg" alt="Login" />
        </form>

        <form className="myform" onSubmit={handleSubmit}>
          <h3>Hi <em>👋</em>, Welcome Back!</h3>

          <div>
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="mydiv">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Link to="/forgot">Reset Password</Link>
            </div>

            <div className="second-div">
              <button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Submit"}
              </button>
              <p>
                Not Having Account? <Link to="/signup">Signup</Link>
              </p>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Login;
