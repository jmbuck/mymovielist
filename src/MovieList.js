import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

import './MovieList.css';
import Movie from './Movie'

class MovieList extends Component {

  renderList = (category) => {
    const movies = this.props.movies[category]

    if(!movies) return <ul></ul>

    return (
        <ul>
            {Object.keys(movies).map(movieId => <Movie key={movieId} category={category} movie={movies[movieId]} delete={this.props.delete} history={this.props.history} />)}
        </ul>
    )
  }

  renderInfo(navProps) {
    const category = navProps.match.params.category
    const id = navProps.match.params.id
    const movies = this.props.movies[category]
    if(!movies) return <div></div>

    const movie = this.props.movies[category][`movie-${id}`]
    if(movie) {
      const path = `https://image.tmdb.org/t/p/w185${movie.poster_path}`
      const date = new Date(movie.release_date)
      const options = {
          month: "long",
          year: "numeric",
          day: "numeric",
      }
       return (
        <div className="movie-info">
          {/*Displays movie poster. If poster does not exist, show "poster does not exist" image*/
              movie.poster_path 
              ? <img src={path} alt="movie poster" />
              : <img src="http://static01.mediaite.com/med/wp-content/uploads/gallery/possilbe-movie-pitches-culled-from-the-mediaite-comments-section/poster-not-available1.jpg" alt="movie poster" />
          }

          <div className="title">{movie.title}</div>
          <div className="date">Release date: {date.toLocaleDateString("en-US", options)}</div>
          
          {
              movie.overview 
              ? <div className="synopsis">Synopsis: {movie.overview}</div>
              : <div className="synopsis">No synopsis available.</div>
          }
        </div>
       )
    }

    return <Redirect to={`/${category}`} />
  }

  render() {
    return (
      <div className="MovieList">
        <Switch>
            <Route path="/completed" render={() => this.renderList('completed')} />
            <Route path="/downloaded" render={() => this.renderList('downloaded')} />
            <Route path="/ptw" render={() => this.renderList('ptw')} />
            <Route path="/dropped" render={() => this.renderList('dropped')} />
        </Switch>
        <Route path="/:category/:id" render={(navProps) => this.renderInfo(navProps)}/>
      </div>
    )
  }
}

export default MovieList;
