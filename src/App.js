import React, { Component } from 'react';

import './App.css';
import Main from './Main'
import base, { movieKey } from './keys'

//http://paletton.com/#uid=64i0u0kllllaFw0g0qFqFg0w0aF

class App extends Component {
  constructor() {
    super()
    this.state = {
      movies: {},
    }
  }

  componentWillMount() {
    this.syncMovies()
  }

  syncMovies = () => {
   this.ref = base.syncState(
      'movies', 
      {
        context: this,
        state: 'movies',
      }
      )
   }
  
  addMovie = (movie, category) => {
    if(!movie.id) {
      movie.id = Date.now()
    }

    const movies = {...this.state.movies}
        
    if(!movies[category]) {
      movies[category] = {}
    }

    let message =`${movie.title} was added to your list successfully!`
    if(movies[category][`movie-${movie.id}`]) {
      message = `${movie.title} already exists in your list!`
      this.setState({ message })
    } else {
      this.setState({ message })
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${movieKey}&append_to_response=credits`)
        .then(response => response.json())
        .then(newMovie => {
            newMovie.watched_date = movie.watched_date
            newMovie.score = movie.score
            movies[category][`movie-${movie.id}`] = newMovie
            this.setState({ movies, message })
      })
    }
  }

  delete = (category, movie) => {
    const movies = {...this.state.movies}
    movies[category][`movie-${movie.id}`] = null;
    this.setState({ movies })
    this.props.history.push(`/${category}`) 
  }

  render() {
    return (
      <div className="App">
        <Main movies={this.state.movies} message={this.state.message} addMovie={this.addMovie} delete={this.delete}/>
      </div>
    );
  }
}

export default App;
