import React, { useState, useRef } from "react";
import { Cancel, Room } from "@material-ui/icons";
import "./login.css";
import axios from "axios";

const Login = ({ setShowLogin }) => {
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      await axios.post("users/register", user);
      setError(false);
      setShowLogin(false)
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room />
        Travel Pin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="loginBtn">Login</button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Cancel
        className="loginCancel"
        onClick={() => setShowLogin(false)}
      />
    </div>
  );
};

export default Login;
