import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

import './Movie.css'

class Movie extends Component {

  options = {
    month: "long",
    year: "numeric",
    day: "numeric",
  }

  directors = []
  screenplay = []
  writers = []

  componentWillMount() {
    if(this.props.movie.credits && this.props.movie.credits.crew) {
      const crew = this.props.movie.credits.crew;
      crew.map((member, i) => {
      if(member.job === 'Director') this.directors.push(member.name)
      if(member.job === 'Screenplay') this.screenplay.push(member.name)
      if(member.job === 'Writer') this.writers.push(member.name)
    })
    }
  }


  handleClick = (ev) => {
     if(this.props.location.pathname !== `/movies/${this.props.category}/${this.props.movie.id}`) {
        this.props.history.push(`/movies/${this.props.category}/${this.props.movie.id}`)
     }  else {
       this.props.history.push(`/movies/${this.props.category}`)
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

        <div className="credits">
          {this.directors.length > 0 ? <div>Director(s): {this.directors.toString().replace(/,/g, ', ')}</div> : <div></div>}
          {this.screenplay.length > 0 ? <div>Screenplay: {this.screenplay.toString().replace(/,/g, ', ')}</div> : <div></div>}
          {this.writers.length > 0 ? <div>Writer(s): {this.writers.toString().replace(/,/g, ', ')}</div> : <div></div>}
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
          
          <div className="duration">Duration: {movie.runtime} minutes</div>
          <div className="budget">Budget: ${movie.budget.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</div>
          <div className="revenue">Revenue: ${movie.revenue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</div>

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
              <button className="button alert" type="button" onClick={() => this.props.delete(this.props.category, this.props.movie)}>Delete</button>
            </div>
            <Route path={`/movies/:category/${this.props.movie.id}`} render={(navProps) => this.renderInfo(navProps)}/>
        </li>
      </div>
    )
  }
}

export default Movie;