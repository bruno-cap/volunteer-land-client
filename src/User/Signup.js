import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Form, Button, Alert } from "react-bootstrap";
import "./Signup.css";

function Signup() {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const history = useHistory();

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    signup(usernameInput, passwordInput)
      .then((data) => {
        history.push("/");
      })
      .catch((error) => {
        setError("An error has occurred, please try again!");
      });
  };

  return (
    <div className="signup smallBox">
      <h2>Signup</h2>
      <form className="signupForm" onSubmit={handleSignupSubmit}>
        <Form.Control
          className="formItem"
          type="text"
          name="username"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          placeholder="Username"
          required
        />
        <Form.Control
          className="formItem"
          type="password"
          name="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <Alert variant="danger">{error}</Alert>}
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Signup;
