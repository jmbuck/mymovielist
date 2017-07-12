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

  getMovieInfo = (movie, path, updateState) => {
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${movieKey}&append_to_response=credits`)
      .then(response => response.json())
      .then(detailedMovie => {
        this.getMainCredits(detailedMovie)
        detailedMovie.score = movie.score
        detailedMovie.watched_date = movie.watched_date
        detailedMovie.rewatches = movie.rewatches
        const newState = { 
                  movie: detailedMovie, 
                  cast: detailedMovie.credits.cast, 
                  crew: detailedMovie.credits.crew, 
                  fetched: true, 
                }
        updateState(newState, path)
      })
  }

  getMainCredits = (detailedMovie) => {
    let directors = [], screenplay = [], writers = [], starring = []
    if(detailedMovie.credits) {
      if(detailedMovie.credits.crew.length > 0) {
        for(const member of detailedMovie.credits.crew) {
          if(member.job === 'Director') directors.push(member.name)
          if(member.job === 'Screenplay') screenplay.push(member.name)
          if(member.job === 'Writer') writers.push(member.name)
        }
      }  
      if(detailedMovie.credits.cast.length > 0) {
        const cast = detailedMovie.credits.cast
        for(let i = 0; i < 3; i++) {
          if(cast[i])
            starring.push(cast[i].name)
        }
      }    
    }
    detailedMovie.directors = directors.toString().replace(/,/g, ', ')
    detailedMovie.screenplay = screenplay.toString().replace(/,/g, ', ')
    detailedMovie.writers = writers.toString().replace(/,/g, ', ')
    detailedMovie.starring = starring.toString().replace(/,/g, ', ')
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

    let newMovie = {movie, message: `${movie.title} was successfully added to your ${category === 'ptw' ? 'plan to watch' : category} list!`}
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
                getMovieInfo={this.getMovieInfo}
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
          <Route path="/" render={() => <Redirect to="/sign-in"/>}/>
        </Switch>
      </div>
    );
  }
}

export default App;
