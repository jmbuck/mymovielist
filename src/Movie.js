import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

import './Movie.css'

class Movie extends Component {

  handleClick = (ev) => {
     if(this.props.location.pathname !== `/${this.props.category}/${this.props.movie.id}`) {
        this.props.history.push(`/${this.props.category}/${this.props.movie.id}`)
     }  else {
       this.props.history.push(`/${this.props.category}`)
     }
  }

  renderInfo(navProps) {
    const category = navProps.match.params.category

    const movie = this.props.movie
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
      <div className="Movie">
        <li className="item" onClick={this.handleClick}>
            <div>{this.props.movie.title}</div>
            <div>{this.props.movie.watched_date}</div>
            <div>
              {this.props.movie.score 
                ? `Score: ${this.props.movie.score}`
                : ''}
            </div>
            <button className="button alert" type="button" onClick={() => this.props.delete(this.props.category, this.props.movie)}>Delete</button>
            <div className="movie-info">
              <Route path={`/:category/${this.props.movie.id}`} render={(navProps) => this.renderInfo(navProps)}/>
            </div>
        </li>
      </div>
    )
  }
}

export default Movie;