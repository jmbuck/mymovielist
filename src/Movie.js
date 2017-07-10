import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { movieKey } from './keys'
import './Movie.css'

class Movie extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      movie: this.props.movie,
      cast: [],
      crew: [],
      fetched: false,
    }
  }
  options = {
    month: "long",
    year: "numeric",
    day: "numeric",
  }

  handleClick = (ev) => {
    const path = `/movies/${this.props.category}/${this.props.movie.id}`
    if(ev.target.classList.contains('credits-button')) { //Credits button is clicked
      if (this.props.location.pathname !== path+'/credits') {
        this.getMovieInfo(this.props.movie, path+'/credits')
      } else {
        this.props.history.push(path)
      }
    } else if(ev.target.classList.contains('edit')) { //Edit button is clicked
      if (this.props.location.pathname !== path+'/edit') {
        this.props.history.push(path+'/edit')
      } else {
        this.props.history.push(path)
      }
    } else if(ev.target.classList.contains('info') || ev.target.classList.contains('info-item')) { //Title bar of movie is clicked
      if(this.props.location.pathname !== path) {
        this.getMovieInfo(this.props.movie, path)
      } else {
        this.props.history.push(`/movies/${this.props.category}`)
      }
    } 
  }

  getMovieInfo = (movie, path) => {
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${movieKey}&append_to_response=credits`)
      .then(response => response.json())
      .then(detailedMovie => {
        this.getMainCredits(detailedMovie)
        detailedMovie.score = movie.score
        detailedMovie.watched_date = movie.watched_date
        this.setState({ 
                        movie: detailedMovie, 
                        cast: detailedMovie.credits.cast, 
                        crew: detailedMovie.credits.crew, 
                        fetched: true, 
                      }, 
        () => this.props.history.push(path))
      })
  }

  getMainCredits = (detailedMovie) => {
    let directors = []
    let screenplay = []
    let writers = []
    let starring = []
    if(detailedMovie.credits) {
      if(detailedMovie.credits.crew.length > 0) {
        detailedMovie.credits.crew.map((member, i) => {
          if(member.job === 'Director') directors.push(member.name)
          if(member.job === 'Screenplay') screenplay.push(member.name)
          if(member.job === 'Writer') writers.push(member.name)
        })
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

  handleSubmit = (movie, ev) => {
    ev.preventDefault()
    console.log(movie)
    const category = ev.target.category.value
    movie.watched_date = ev.target.date.value
    const score = ev.target.score.value
    score ? movie.score = parseInt(score, 10) : movie.score = 0
    if(category !== this.props.category) {
      this.props.addMovie({ id: movie.id, 
                             runtime: movie.runtime,
                             score: movie.score,
                             title: movie.title,
                             watched_date: movie.watched_date}, category, true)
      this.props.delete(this.props.category, movie)
    } else {
      this.props.saveMovie({ id: movie.id, 
                             runtime: movie.runtime,
                             score: movie.score,
                             title: movie.title,
                             watched_date: movie.watched_date}, category)
    }
    this.props.history.push(`/movies/${this.props.category}/${this.props.movie.id}`)
  }

  renderCredits = (navProps, movie) => {
    if(!this.state.cast.length && !this.state.crew.length && this.state.fetched) {
      return <div className="credits">No credits to display</div>
    } else {
      return(
        <div className="credits">
          {
            this.state.cast.length 
            ? (<div className="cast"> 
                <div>CAST</div>
                <ul>
                  {this.state.cast.map((member, i) => {
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
            this.state.crew.length 
            ? (
              <div className="crew"> 
                <div>CREW</div>
                <ul>
                  {this.state.crew.map((member, i) => {
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

  renderEditForm = (navProps, movie) => {
    const category = this.props.category
    let today = new Date()
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
  
    if(dd<10) dd = '0'+dd
    if(mm<10) mm = '0'+mm
    today = `${yyyy}-${mm}-${dd}`
    return (
      <form onSubmit={(ev) => this.handleSubmit(movie, ev)}>
        <div className="edit-movie">
            <div className="category">
              <input type="radio" name="category" value="completed" defaultChecked={category === 'completed'}/>Completed<br/>
              <input type="radio" name="category" value="ptw" defaultChecked={category === 'ptw'}/>Plan to Watch<br/>
              <input type="radio" name="category" value="dropped" defaultChecked={category === 'dropped'}/>Dropped<br/>
            </div>
            <div className="others">
              Date watched: <input type="date" name="date" defaultValue={movie.watched_date} max={today}/>
              <select name="score" defaultValue={movie.score}>
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
          <div className="stacked-for-small radius button-group">
            <button className="button success" type="submit">Confirm</button>
            <button className="button alert" type="button" onClick={() => {
                this.props.history.push(`/movies/${this.props.category}/${this.props.movie.id}`)
              }}>Cancel</button>
          </div>
      </form>
    )
  }

  renderInfo = (navProps) => {
    if(!this.state.fetched) {
      this.getMovieInfo(this.props.movie, navProps.location.pathname)
    }
    const category = navProps.match.params.category

    const movie = this.state.movie
    if(movie && this.state.fetched) {
      const path = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
      const release_date = new Date(movie.release_date)
      release_date.setDate(release_date.getDate()+1)
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
          <Route path={`/movies/${category}/${movie.id}/edit`} render={(navProps) => this.renderEditForm(navProps, movie)}/>
        </div>
      )
    }
    return <Redirect to={`/movies/${category}`} />
  }

  render() {
    const watched_date = new Date(this.props.movie.watched_date)
    watched_date.setDate(watched_date.getDate()+1)
    return (
      <div className="Movie">
        <li className="item" onClick={this.handleClick}>
            <div className="info">
              <div className="info-item">{this.props.movie.title}</div>
              { this.props.movie.watched_date 
                ? <div className="info-item">{watched_date.toLocaleDateString("en-US", this.options)}</div>
                : <div className="info-item"></div>
              } 
              <div className="info-item score">
                {this.props.movie.score 
                  ? `${this.props.movie.score}`
                  : '-'}
              </div>
            </div>
            <Route path={`/movies/:category/${this.props.movie.id}`} render={(navProps) => this.renderInfo(navProps)}/>
        </li>
      </div>
    )
  }
}

export default Movie;