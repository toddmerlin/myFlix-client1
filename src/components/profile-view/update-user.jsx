import React, { useState } from "react";
import { Container, Form, Button, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export const UpdateUser = ({ user, token, onUpdateUser }) => {
  const navigate = useNavigate();

  // State to manage whether the form is visible or not
  const [formData, setFormData] = useState({
    id: user.id,
    Username: user.Username,
    Password: "",
    Email: user.Email,
    Birthday: user.Birthday,
    FavoriteMovies: user.FavoriteMovies,
  });

  // Function to handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestBody = {
      Username: formData.Username, // Keep the username the same
      Password: formData.Password, // Keep the password the same
      Email: formData.Email, // Update the email address
    };

    fetch(`https://myflix-ssv7.onrender.com/users/${user.Username}`, {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error updating user!!");
        }
      })
      .then((updatedUser) => {
        // Handle success, such as displaying a success message or redirecting the user
        onUpdateUser(updatedUser);
        navigate("/users");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <>
      <Container style={{ marginTop: "20px", textAlign: "center" }}>
        <h2>Update User</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              required
              autoComplete="currentpassword"
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Col style={{ display: "flex", justifyContent: "space-around" }}>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
            <Link to="/users">
              <Button variant="secondary">Cancel</Button>
            </Link>
          </Col>
        </Form>
      </Container>
    </>
  );
};
