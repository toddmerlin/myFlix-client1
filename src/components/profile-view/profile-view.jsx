import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { MovieCard } from "../movie-card/movie-card";

// import { UpdateUser } from "./update-user";
import "./profile-view.scss";

export const ProfileView = ({ token }) => {
  const user = useSelector((state) => state.user);
  const movie = useSelector((state) => state.movies);
  const [favorites, setFavorites] = useState([]);

  console.log("user", user);
  // Function to format the date to "dd-mm-yyyy" format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const deleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (confirmed) {
      fetch(`https://myflix-ssv7.onrender.com/users/${user.Username}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (response.ok) {
            alert("Your account has been deleted. Goodbye!");
            localStorage.clear(); // Clear localStorage
            window.location.replace("/signup"); // Redirect to the SignupView
          } else {
            alert("Could not delete account");
          }
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  useEffect(() => {
    const favorites = user.FavoriteMovies.map((movieId) => {
      return movie.find((m) => m.id === movieId);
    });
    setFavorites(favorites);
  }, [user.FavoriteMovies, movie]);

  return (
    <Container style={{ marginTop: "20px", textAlign: "center" }}>
      <Row>
        <Col>
          <h2>{user.Username}'s Profile</h2>

          <div>
            <p>Username: {user.Username}</p>
            <p>Email: {user.Email}</p>
            <p>Birthday: {formatDate(user.Birthday)}</p>
          </div>
          <Col style={{ display: "flex", justifyContent: "space-around" }}>
            <Link to={`/users/${user.Username}`}>
              <Button variant="primary">Edit</Button>
            </Link>

            <Button variant="danger" onClick={deleteAccount}>
              Delete
            </Button>

            <Link to="/">
              <Button variant="secondary">Back</Button>
            </Link>
          </Col>
        </Col>
      </Row>

      <Row>
        <h2 className="mt-5">Favorites</h2>
      </Row>
      <Row>
        {favorites.length === 0 ? (
          <Col>
            <p>Added favorite movies will appear here</p>
          </Col>
        ) : (
          <div className="d-flex flex-wrap justify-content-center">
            {favorites.map((movie) => (
              <div
                className="mb-4 mx-3"
                key={movie.id}
                style={{ width: "125px" }}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </Row>
    </Container>
  );
};
