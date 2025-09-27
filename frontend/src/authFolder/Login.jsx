import React, { useState } from "react";
import "../App.css";
import './auth.css'
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true; // Ye line token/cookie ke liye zaroori hai

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      // ## CHANGE YAHAN HAI: Ab hum message ki jagah status code check kar rahe hain ##
      if (response.status === 200) { // 200 ka matlab hai "OK/Success"
        
        toast.success(response.data.message); // Backend se aaya hua message dikhao
        
        // Form ko clear karo
        setEmail("");
        setPassword("");
        
        // Thoda ruk kar home page par bhej do
        setTimeout(() => {
          // NOTE: Apne App.jsx mein check kar lena ki home page ka route /home hai ya /homeblog
          navigate("/homeblog"); 
        }, 1500);
      }
    } catch (error) {
      // Error handling ko aasan kar diya
      const errorMessage = error.response?.data?.message || "An unknown error occurred!";
      toast.error(errorMessage);

      // Agar email verified nahi hai to uss page par bhej do
      if (error.response?.data?.redirect) {
        navigate(error.response.data.redirect);
      }
    } finally {
      // Yahan sirf loading ko false karo
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <ToastContainer
        position="top-center"
        autoClose={1500}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      <div className="container">
        <form>
          <img src="./login-pana.svg" alt="Login" />
        </form>
        <form className="myform" onSubmit={handleSubmit}>
          <h3>
            Hi <em>👋</em>, Welcome Back!
          </h3>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="mydiv">
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* NOTE: Iska route /forgot-password ki jagah /forgot ho sakta hai, check kar lena */}
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