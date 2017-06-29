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
      `movies`, 
      {
        context: this,
        state: 'movies',
      }
      )
   }
  
  addMovie = (category, movie) => {
    if(!movie.id) {
      movie.id = Date.now()
    }

    const movies = {...this.state.movies}
        
    if(!movies[category]) {
      movies[category] = {}
    }

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${movieKey}&query=${movie.title}`)
      .then(response => response.json())
      .then(data => {
        const id = movie.id
        movie = data.results[0]
        movie.id = id
        movies[category][`movie-${movie.id}`] = movie
        this.setState({ movies })
      })
  }

  render() {
    return (
      <div className="App">
        <Main movies={this.state.movies} addMovie={this.addMovie}/>
      </div>
    );
  }
}

export default App;
