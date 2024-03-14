import React, { useState } from "react";
import { Container, Form, Button, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/reducers/user/user";

export const UpdateUser = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State to manage whether the form is visible or not
  const [formData, setFormData] = useState({
    id: user.Id,
    Username: user.Username,
    Password: "",
    Email: user.Email,
    Birthday: user.Birthday,
    FavoriteMovies: user.FavoriteMovies,
  });

  console.log("Form data:", formData);
  console.log("SetformData:", setFormData);

  // Function to handle input changes
  const handleChange = (event) => {
    // Get the name and value of the input
    const { name, value } = event.target;
    // Update the state with the new value
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    // Prevent the default form submission
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // Merge the updated data with the existing user data
          const updatedUser = { ...user, ...requestBody };
          dispatch(setUser(updatedUser));
          // Update user data in Redux store
          localStorage.setItem("user", JSON.stringify(updatedUser));
          alert(`${user.Username}` + " updated successfully");
          navigate("/users"); // Redirect to user profile page
        } else {
          throw new Error("Failed to update user");
        }
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
