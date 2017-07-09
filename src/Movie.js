import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { movieKey } from './keys'
import './Movie.css'

class Movie extends Component {

  options = {
    month: "long",
    year: "numeric",
    day: "numeric",
  }

  cast = []
  crew = []
  fetched = false

  handleClick = (ev) => {
    const path = `/movies/${this.props.category}/${this.props.movie.id}`
    if(!ev.target.classList.contains('credits-button')) {
      if(this.props.location.pathname !== path) {
        this.props.history.push(path)
      } else {
        this.props.history.push(`/movies/${this.props.category}`)
      }
    } else {
      if (this.props.location.pathname !== path+'/credits') {
        this.showCredits(this.props.movie)
      } else {
        this.props.history.push(path)
      }
    } 
  }

  showCredits = (movie) => {
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${movieKey}`)
      .then(response => response.json())
      .then(credits => {
        this.cast = credits.cast
        this.crew = credits.crew
        this.fetched = true
        this.props.history.push(`/movies/${this.props.category}/${movie.id}/credits`)
    })
  }

  renderCredits(navProps, movie) {
    if(!this.fetched) {
      this.showCredits(movie)
    }
    if(!this.cast.length && !this.crew.length && this.fetched) {
      return <div className="credits">No credits to display</div>
    } else {
      return(
        <div className="credits">
          {
            this.cast.length 
            ? (<div className="cast"> 
                <div>CAST</div>
                <ul>
                  {this.cast.map((member, i) => {
                    if(i < 25 && member) {
                      return (
                        <li key={i}>
                          {member.name} as {member.character}
                        </li>
                      )
                    }
                  })}
                </ul>
              </div>
              )
          : <div className="cast">No cast to display</div>
          }
          {
            this.crew.length 
            ? (
              <div className="crew"> 
                <div>CREW</div>
                <ul>
                  {this.crew.map((member, i) => {
                    if(i < 25 && member) {
                      return (
                        <li key={i}>
                          {member.job} - {member.name}
                        </li>
                      )
                    }
                  })}
                </ul>
              </div>
            )
            : <div className="crew">No crew to display</div>
          }        
        </div>
      )
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
          <div className="main">
            {/*Displays movie poster. If poster does not exist, show "poster does not exist" image*/
                movie.poster_path 
                ? <img src={path} alt="movie poster" />
                : <img src="http://static01.mediaite.com/med/wp-content/uploads/gallery/possilbe-movie-pitches-culled-from-the-mediaite-comments-section/poster-not-available1.jpg" alt="movie poster" />
            }
            
            <div className="not-poster">   

              <div className="credits-preview">
                {movie.directors ? <div>Director(s): {movie.directors}</div> : <div></div>}
                {movie.screenplay ? <div>Screenplay: {movie.screenplay}</div> : <div></div>}
                {movie.writers ? <div>Writer(s): {movie.writers}</div> : <div></div>} 
                {movie.starring ? <div>Starring: {movie.starring}</div> : <div></div>} 
              </div>

              {
                  movie.overview 
                  ? <div className="synopsis">Synopsis: {movie.overview}</div>
                  : <div className="synopsis">No synopsis available.</div>
              }

              {
                movie.tagline
                ? <div className="tagline">Tagline: {movie.tagline}</div>
                : <div className="tagline"></div>
              }
              {
                movie.release_date 
                ? <div className="date">Released: {release_date.toLocaleDateString("en-US", this.options)}</div>
                : <div className="date">Unknown release date</div>
              }
              
              {movie.runtime ? <div className="duration">Duration: {movie.runtime} minutes</div> : <div className="duration"></div>}
              {movie.budget ? <div className="budget">Budget: ${movie.budget.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</div> : <div className="budget"></div>}
              {movie.revenue ? <div className="revenue">Revenue: ${movie.revenue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</div> : <div className="revenue"></div>}

              {
                movie.genres 
                ? (
                  <div className="genres">Genres:&nbsp;
                    {
                        movie.genres.map((genre, i) => i !== movie.genres.length-1 ? <span key={i}>{genre.name}, </span> : <span key={i}>{genre.name}</span>)
                    }
                  </div>)
                : <div className="genres"></div>
              }

              {
                movie.imdb_id 
                ? <a href={`http://www.imdb.com/title/${movie.imdb_id}/`} target="_blank" rel="noopener noreferrer">IMDB Page</a>
                : <div></div>
              } 
            </div>
          </div>
          <div className="expanded stacked-for-small radius button-group">
            <a className="button credits-button">Cast and crew</a>
            <a className="button edit warning">Edit</a>
            <a className="button delete alert" onClick={() => this.props.delete(this.props.category, this.props.movie)}>Delete</a>
          </div>
          <Route path={`/movies/${category}/${movie.id}/credits`} render={(navProps) => this.renderCredits(navProps, movie)}/>   
        </div>
      )
    }
    return <Redirect to={`/movies/${category}`} />
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
                  : 'Score: -'}
              </div>
            </div>
            <Route path={`/movies/:category/${this.props.movie.id}`} render={(navProps) => this.renderInfo(navProps)}/>
        </li>
      </div>
    )
  }
}

export default Movie;