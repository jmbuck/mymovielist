import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

import './Movie.css'

class Movie extends Component {

  options = {
    month: "long",
    year: "numeric",
    day: "numeric",
  }

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
      const path = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
      const release_date = new Date(movie.release_date)
      return (
      <div className="more-info">
        {/*Displays movie poster. If poster does not exist, show "poster does not exist" image*/
            movie.poster_path 
            ? <img src={path} alt="movie poster" />
            : <img src="http://static01.mediaite.com/med/wp-content/uploads/gallery/possilbe-movie-pitches-culled-from-the-mediaite-comments-section/poster-not-available1.jpg" alt="movie poster" />
        }
        <div className="not-poster">
          <div className="date">Released: {release_date.toLocaleDateString("en-US", this.options)}</div>
          
          {
              movie.overview 
              ? <div className="synopsis">Synopsis: {movie.overview}</div>
              : <div className="synopsis">No synopsis available.</div>
          }
        </div>
      </div>
      )
    }

    return <Redirect to={`/${category}`} />
  }

  render() {
    const watched_date = new Date(this.props.movie.watched_date)
    return (
      <div className="Movie">
        <li className="item" onClick={this.handleClick}>
            <div className="info">
              <div>{this.props.movie.title}</div>
              { this.props.movie.watched_date 
                ? <div>Watched: {watched_date.toLocaleDateString("en-US", this.options)}</div>
                : <div></div>
              } 
              <div>
                {this.props.movie.score 
                  ? `Score: ${this.props.movie.score}`
                  : ''}
              </div>
              <button className="button alert" type="button" onClick={() => this.props.delete(this.props.category, this.props.movie)}>Delete</button>
            </div>
            <Route path={`/:category/${this.props.movie.id}`} render={(navProps) => this.renderInfo(navProps)}/>
        </li>
      </div>
    )
  }
}

export default Movie;