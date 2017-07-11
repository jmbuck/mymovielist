import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

import './MovieResult.css'

class MovieResult extends Component {

  constructor(props) {
    super(props)
    this.state = {
      movie: this.props.movie,
      cast: [],
      crew: [],
      fetched: false,
    }
  }

  handleClick = (ev) => {
      if(ev.target.classList.contains('button')) return
      this.props.setAdded(false)
      const path = `/movies/new/${this.props.match.params.query}/${this.props.match.params.page}`
      if(this.props.location.pathname !== `${path}/${this.props.index}`) {
        this.props.getMovieInfo(this.props.movie, `${path}/${this.props.index}`, this.updateState)
      } else {
        this.props.history.push(path)
      }
  }
  
  handleSubmit = (movie, ev, quickAdd=false) => {
      ev.preventDefault()
      const newMovie = {}
      let category;
      const path = `/movies/new/${this.props.match.params.query}/${this.props.match.params.page}`
      if(quickAdd) {
        category = 'completed'
        newMovie.watched_date = '';
        newMovie.score = 0;
        if(!this.state.fetched) {
          this.props.getMovieInfo(movie, path, (data) => {
            this.finishAdding(newMovie, data.movie, category)
          })
        } else {
          this.finishAdding(newMovie, movie, category)
        }
      } else {
        category = ev.target.category.value
        newMovie.watched_date = ev.target.date.value
        const score = ev.target.score.value
        score ? newMovie.score = parseInt(score, 10) : newMovie.score = 0      
        this.finishAdding(newMovie, movie, category)
        this.props.history.push(`/movies/new/${this.props.match.params.query}/${this.props.match.params.page}`)
      }
  }

  finishAdding = (newMovie, movie, category) => {
    newMovie.id = movie.id
    newMovie.title = movie.title
    newMovie.runtime = movie.runtime
    this.props.addMovie(newMovie, category)
    this.props.setAdded(true)
  }

  updateState = (newState, path) => {
    this.setState(newState, () => this.props.history.push(path))
  }

  renderResultInfo = (navProps) => {
    if(!this.state.fetched) {
      this.props.getMovieInfo(this.props.movie, navProps.location.pathname, this.updateState)
    }
    const movie = this.state.movie
    if(movie && this.state.fetched) {
      const path = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
      const date = new Date(movie.release_date)
      const options = {
          month: "long",
          year: "numeric",
          day: "numeric",
      }

      let today = new Date()
      let dd = today.getDate();
      let mm = today.getMonth()+1;
      let yyyy = today.getFullYear();
    
      if(dd<10) dd = '0'+dd
      if(mm<10) mm = '0'+mm
      today = `${yyyy}-${mm}-${dd}`
      
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
                  ? <div className="date">Released: {date.toLocaleDateString("en-US", options)}</div>
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
                  movie.rewatches 
                  ? <div className="rewatches"># of rewatches: {movie.rewatches}</div> : <div className="rewatches"></div>
                }

                {
                  movie.imdb_id 
                  ? <a href={`http://www.imdb.com/title/${movie.imdb_id}/`} target="_blank" rel="noopener noreferrer">IMDB Page</a>
                  : <div></div>
                } 
              </div>
            </div>
            <form onSubmit={(ev) => this.handleSubmit(movie, ev)}>
              <div className="add-movie">
                  <div className="category">
                    <input type="radio" name="category" value="completed" defaultChecked/>Completed<br/>
                    <input type="radio" name="category" value="ptw" />Plan to Watch<br/>
                    <input type="radio" name="category" value="dropped" />Dropped<br/>
                  </div>
                  <div className="optional">
                    <div className="date">
                      Date watched: 
                      <a onClick={() => {
                        document.querySelector('.optional input').value = today
                        }}>Insert Today
                      </a>
                      <input type="date" name="date" max={today}/>
                    </div>
                    <select name="score">
                        <option value="">-- Score --</option>
                        <option value="10">10</option>
                        <option value="9">9</option>
                        <option value="8">8</option>
                        <option value="7">7</option>
                        <option value="6">6</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                    </select>
                  </div>
                </div>
                <button className="button success" type="submit">Add Movie</button>
            </form>
          </div>
      )
    }
    return <Redirect to={`/movies/new/${this.props.match.params.query}/${this.props.match.params.page}`} />
  }

  render() {
    return (
      <div className="MovieResult">
        <li className="item">
          <div className="info" onClick={this.handleClick}>
            {this.props.movie.title} ({this.props.movie.release_date 
                                      ? (new Date(this.props.movie.release_date)).toLocaleDateString("en-us", {year: 'numeric'})
                                      : 'Unknown'})
            <button className="button success" type="button" onClick={(ev) => this.handleSubmit(this.props.movie, ev, true)}>Quick add to completed</button>
          </div>
          <Route 
            path={`/movies/new/${this.props.match.params.query}/${this.props.match.params.page}/${this.props.index}`} 
            render={(navProps) => this.renderResultInfo(navProps)}
          />
        </li>
      </div>
    )
  }
}

export default MovieResult;