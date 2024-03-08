import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";

import "./movie-card.scss";

import { Link } from "react-router-dom";

export const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movies/${encodeURIComponent(movie.Title)}`}>
      <Card className="h-100 border-0">
        <Card.Img variant="top" src={movie.ImagePath} />
      </Card>
    </Link>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    Title: PropTypes.string.isRequired,
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    }),
    ImagePath: PropTypes.string.isRequired,
  }).isRequired,
};
