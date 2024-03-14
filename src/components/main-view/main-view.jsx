import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { setMovies } from "../../redux/reducers/movies";
import { setUser } from "../../redux/reducers/user/user";

import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import { UpdateUser } from "../profile-view/update-user";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const storedToken = localStorage.getItem("token");

  const movies = useSelector((state) => state.movies);
  const user = useSelector((state) => state.user);

  const [similarMovies, setSimilarMovies] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!storedToken) {
      return;
    }

    fetch("https://myflix-ssv7.onrender.com/movies", {
      headers: { Authorization: `Bearer ${"token"}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const moviesFromApi = data.map((movie) => {
          return {
            id: movie._id,
            Title: movie.Title,
            Description: movie.Description,
            ImagePath: movie.ImagePath,
            Genre: {
              Name: movie.Genre.Name,
              Description: movie.Genre.Description,
            },
            Director: {
              Name: movie.Director.Name,
              Bio: movie.Director.Bio,
              Birth: movie.Director.Birth,
              Death: movie.Director.Death,
            },
            Featured: movie.Featured,
            Actors: movie.Actors,
          };
        });

        dispatch(setMovies(moviesFromApi));
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, [dispatch, storedToken]);

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  console.log("movies:", movies);

  return (
    <BrowserRouter>
      <Row>
        <>
          <NavigationBar
            onLoggedOut={() => {
              setUser(null);
              setToken(null);
            }}
          />
        </>
      </Row>
      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/signup"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <SignupView
                      onSignedUp={(user, token) => {
                        localStorage.setItem("user", JSON.stringify(user));
                        localStorage.setItem("token", token);
                        setUser(user);
                        setToken(token);
                      }}
                    />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <LoginView
                      onLoggedIn={(token) => {
                        setToken(token);
                      }}
                    />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/movies/:movieTitle"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>The list is empty</Col>
                ) : (
                  <Col md={8}>
                    <MovieView
                      setUser={setUser}
                      similarMovies={similarMovies}
                    />
                  </Col>
                )}
              </>
            }
          />

          <Route
            path="/"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>The list is empty</Col>
                ) : (
                  <>
                    {movies.map((movie) => (
                      <Col className="mb-4" key={movie.id} md={3}>
                        <MovieCard movie={movie} />
                      </Col>
                    ))}
                  </>
                )}
              </>
            }
          />
          <Route
            path="/users"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : (
                  <ProfileView
                    onLoggedOut={() => {
                      setUser(null);
                      setToken(null);
                    }}
                  />
                )}
              </>
            }
          />
          <Route
            path="/users/:username"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : (
                  <UpdateUser
                    onLoggedIn={(token) => {
                      setToken(token);
                    }}
                    onLoggedOut={() => {
                      setUser(null);
                      setToken(null);
                    }}
                    onUpdateUser={handleUpdateUser}
                  />
                )}
              </>
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
