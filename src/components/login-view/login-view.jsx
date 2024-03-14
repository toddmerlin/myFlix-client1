import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/reducers/user/user";

export const LoginView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
    };

    fetch("https://myflix-ssv7.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status < 400) {
          return response.json();
        } else {
          return response.json().then((data) => {
            throw new Error(data.message || "Something went wrong");
          });
        }
      })
      .then((data) => {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        dispatch(setUser(data.user));

        console.log(data.token);
      })
      .catch((error) => {
        console.error("Error during login:", error.message);
        if (error.message === "User not found") {
          alert("User not found");
        } else if (error.message === "Incorrect password") {
          alert("Incorrect password");
        } else {
          alert("Something went wrong"); // Display generic error message for other errors
        }
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formUsernameLogin">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength="3"
          autoComplete="username"
        />
      </Form.Group>

      <Form.Group controlId="formPasswordLogin">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};
