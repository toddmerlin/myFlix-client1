import { useParams } from "react-router";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useEffect, useReducer, useState } from "react";

import { Link } from "react-router-dom";

import { BsHeart, BsHeartFill } from "react-icons/bs"; // Import heart icons from react-icons

import "./movie-view.scss";

export const MovieView = ({ movies, user, token, setUser }) => {
  const { movieTitle } = useParams();
  const movie = movies.find((m) => m.Title === movieTitle);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavorite, setIsFavorite] = useState([]);

  // this function is used to get similar movies based on the movies genre and exclude the current movie
  useEffect(() => {
    const similar = movies.filter(
      (m) => m.Genre.Name === movie.Genre.Name && m.id !== movie.id
    );
    setSimilarMovies(similar);
    setIsFavorite(user && user.FavoriteMovies.includes(movie.id));
  }, [movies, user, movie]);

  // console.log(
  //   "Favorite movies:",
  //   user.FavoriteMovies.map((movieId) => {
  //     // Find the movie with the matching id
  //     const movie = movies.find((m) => m.id === movieId);
  //     // Return the movie title
  //     return movie ? movie.Title : "Unknown Title";
  //   })
  // );

  // Function to handle both add and remove users favorite movies
  const handleFavoriteClick = async (movieId) => {
    try {
      const method = isFavorite ? "DELETE" : "POST";

      const response = await fetch(
        `https://myflix-ssv7.onrender.com/users/${user.Username}/movies/${movieId}`,

        {
          method: method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the fetch request was successful
      if (response.ok) {
        console.log(response);
        // Update the user's favorite movies
        setIsFavorite(!isFavorite); // Toggle the favorite status
        // Update the user state to reflect the change
        const updatedUser = { ...user };
        // Update the user's favorite movies
        if (isFavorite) {
          // Remove the movie from the list
          updatedUser.FavoriteMovies = updatedUser.FavoriteMovies.filter(
            (id) => id !== movieId
          );
        } else {
          // Add the movie to the list
          updatedUser.FavoriteMovies = [...updatedUser.FavoriteMovies, movieId];
        }
        // Update the user state to include the added or removed movie

        setUser(updatedUser);

        // Display a success message
        const message = isFavorite ? "removed from" : "added to";
        alert(`Movie ${movie.Title} ${message} favorites.`);
      } else {
        // Display an error message
        console.error("Failed to update favorites:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <Card className="mx-auto border-0">
      <img src={movie.ImagePath} alt={movie.Title} style={{ width: "40%" }} />

      <Card.Body>
        <Card.Title style={{ textAlign: "center" }}>
          <h2>{movie.Title}</h2>
        </Card.Title>

        <Row>
          <Col md={4}>
            <h5>Description: </h5>
          </Col>
          <Col md={8}>
            <p>{movie.Description}</p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <h5>Director:</h5>
          </Col>
          <Col md={8}>
            <p>{movie.Director.Name}</p>
          </Col>
        </Row>
        <Col style={{ display: "flex", justifyContent: "space-between" }}>
          <Link to={`/`}>
            <Button className="back-button">Back</Button>
          </Link>
          <Button
            variant="danger"
            onClick={() => handleFavoriteClick(movie.id)}
          >
            {isFavorite ? <BsHeartFill /> : <BsHeart />}
          </Button>
        </Col>
      </Card.Body>
      <Row>
        <h3> Similar Movies</h3>
      </Row>
      <Row>
        {similarMovies.map((movie) => (
          <Col key={movie.id} md={3}>
            <Link
              to={`/movies/${encodeURIComponent(movie.Title)}`}
              className="movie-link"
            >
              <img
                src={movie.ImagePath}
                alt={movie.Title}
                style={{ width: "100%", cursor: "pointer" }}
              />
            </Link>
          </Col>
        ))}
      </Row>
    </Card>
  );
};
