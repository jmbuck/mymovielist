import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

import './App.css';
import Main from './Main'
import base from './keys'

//http://paletton.com/#uid=64i0u0kllllaFw0g0qFqFg0w0aF

class App extends Component {
  constructor() {
    super()
    this.state = {
      movies: {},
    }
  }

  componentWillMount() {
    this.syncMovies();
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
  
  addMovie = (movie) => {
    if(!movie.id) {
      movie.id = Date.now()
    }
    console.log('Title: '+movie.title)
    const movies = {...this.state.movies}
    movies[`movie-${movie.id}`] = movie
    this.setState({ movies })
  }

  render() {
    return (
      <div className="App">
        <Main addMovie={this.addMovie}/>
      </div>
    );
  }
}

export default App;
