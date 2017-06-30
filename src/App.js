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

    console.log('fetched details')
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${movieKey}&append_to_response=credits`)
      .then(response => response.json())
      .then(movie => {
        movies[category][`movie-${movie.id}`] = movie
        this.setState({ movies })
      })
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
        <Main movies={this.state.movies} addMovie={this.addMovie} delete={this.delete}/>
      </div>
    );
  }
}

export default App;
