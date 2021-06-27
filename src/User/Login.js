import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import "./Login.css";

function Login() {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const { login } = useAuth();

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    login(usernameInput, passwordInput)
      .then((data) => {
        history.push("/");
      })
      .catch((error) => {
        setError("An error has occurred, please try again!");
      });
  };

  return (
    <div className="login smallBox">
      <h2>Login</h2>

      <form className="loginForm" onSubmit={handleLoginSubmit}>
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

export default Login;
