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

    stopSyncing = () => {
      if(this.ref) {
        base.removeBinding(this.ref)
      }
   }

  authHandler = (user) => {
      localStorage.setItem('uid', user.uid)
      this.setState({ uid: user.uid }, this.syncMovies)
   }

  isDuplicate(input) {
    const movies = {...this.state.movies}
    if(movies['completed'] && movies['completed'][`movie-${input.movie.id}`]) {
      input.message = `${input.movie.title} already exists in your completed list!`
      return true;
    } else if(movies['ptw'] && movies['ptw'][`movie-${input.movie.id}`]) {
      input.message = `${input.movie.title} already exists in your plan to watch list!`
      return true;
    } else if(movies['dropped'] && movies['dropped'][`movie-${input.movie.id}`]) {
      input.message = `${input.movie.title} already exists in your dropped list!`
      return true;
    } 
    return false;
  }

  saveMovie = (movie, category) => {
    const movies = {...this.state.movies}
    movies[category][`movie-${movie.id}`] = movie
    this.setState({ movies })
  }
  
  addMovie = (movie, category, copy=false) => {
    if(!movie.id) {
      movie.id = Date.now()
    }

    const movies = {...this.state.movies}
        
    if(!movies[category]) {
      movies[category] = {}
    }

    let newMovie = {movie, message: `${movie.title} was added to your list successfully!`}
    if(!this.isDuplicate(newMovie) || copy) {
        movies[category][`movie-${movie.id}`] = movie
        this.setState({ movies })
    }
    this.setState({ message: newMovie.message })
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
            ? <Main 
                movies={this.state.movies} 
                message={this.state.message} 
                saveMovie={this.saveMovie} 
                addMovie={this.addMovie} 
                delete={this.delete} 
                signOut={this.signOut}
              />
            : <Redirect to="/sign-in" />
          }/>
          <Route path="/sign-in" render={() => 
            !this.signedIn() 
            ? <SignIn />
            : <Redirect to="/movies"/>
          }/>
          <Route path="/" render={() => <Redirect to="/movies"/>}/>
        </Switch>
      </div>
    );
  }
}

export default App;
