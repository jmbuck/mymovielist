import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom'

import './App.css';
import Main from './Main'
import SignIn from './SignIn'
import base, { auth, movieKey } from './keys'

//http://paletton.com/#uid=64i0u0kllllaFw0g0qFqFg0w0aF

class App extends Component {
  constructor() {
    super()
    this.state = {
      movies: {},
      uid: null,
    }
  }

  componentWillMount() {
    this.getUserFromLocalStorage()
    auth.onAuthStateChanged(
      (user) => {
         if(user) {
           //Finish Signing in
           this.authHandler(user)
         } else {
           //Finish Signing out
           this.setState({ uid: null })
         }
      }
    )
  }
  
  getUserFromLocalStorage = () => {
    const uid = localStorage.getItem('uid')
    if(!uid) return
    this.setState({ uid })
  }

  syncMovies = () => {
   this.ref = base.syncState(
      `movies/${this.state.uid}`, 
      {
        context: this,
        state: 'movies',
      }
      )
   }

  signedIn = () => {
       return this.state.uid
   }

  signOut = () =>{
     auth
      .signOut()
      .then(() => {
        this.stopSyncing()
        this.setState({ movies: {} })
      })
   }

  authHandler = (user) => {
      localStorage.setItem('uid', user.uid)
      this.setState({ uid: user.uid }, this.syncMovies)
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
    this.props.history.push(`/movies/${category}`) 
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/movies" render={() =>
            this.signedIn() 
            ? <Main movies={this.state.movies} message={this.state.message} addMovie={this.addMovie} delete={this.delete} />
            : <Redirect to="/sign-in" />
          }/>
          <Route path="/sign-in" render={() => 
            !this.signedIn() 
            ? <SignIn />
            : <Redirect to="/movies"/>
          }/>
        </Switch>
      </div>
    );
  }
}

export default App;
