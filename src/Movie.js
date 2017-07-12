import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

import './Movie.css'
import MovieInfo from './MovieInfo'
import MovieCredits from './MovieCredits'

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

  handleClick = (ev) => {
    const path = `/movies/${this.props.category}/${this.props.movie.id}`
    if(ev.target.classList.contains('credits-button')) { //Credits button is clicked
      if (this.props.location.pathname !== path+'/credits') {
        this.props.history.push(path+'/credits')
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
        this.props.getMovieInfo(this.props.movie, path, this.updateState)
      } else {
        this.props.history.push(`/movies/${this.props.category}`)
      }
    } 
  }

  updateState = (newState, path) => {
    this.setState(newState, () => this.props.history.push(path))
  }

  handleSubmit = (movie, ev) => {
    ev.preventDefault()
    const category = ev.target.category.value
    movie.watched_date = ev.target.date.value
    const score = ev.target.score.value
    const rewatches = ev.target.rewatches.value
    score ? movie.score = parseInt(score, 10) : movie.score = 0
    rewatches && !isNaN(rewatches) && rewatches > 0 ? movie.rewatches = parseInt(rewatches, 10) : movie.rewatches = 0

    if(category !== this.props.category) {
      this.props.addMovie({ id: movie.id, 
                             runtime: movie.runtime,
                             rewatches: movie.rewatches,
                             score: movie.score,
                             title: movie.title,
                             watched_date: movie.watched_date}, category, true)
      this.props.delete(this.props.category, movie)
    } else {
      this.props.saveMovie({ id: movie.id, 
                             runtime: movie.runtime,
                             rewatches: movie.rewatches,
                             score: movie.score,
                             title: movie.title,
                             watched_date: movie.watched_date}, category)
    }
    this.props.history.push(`/movies/${this.props.category}/${this.props.movie.id}`)
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
              Rewatches: <input type="text" name="rewatches" defaultValue={movie.rewatches} placeholder="# of rewatches"/>
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
      this.props.getMovieInfo(this.props.movie, navProps.location.pathname, this.updateState)
    }
    const category = navProps.match.params.category
    const movie = this.state.movie
    if(movie && this.state.fetched) {
      return (
        <div>
          <MovieInfo {...this.props} {...navProps} movie={this.state.movie}/>
          <div className="expanded stacked-for-small radius button-group">
            <a className="button credits-button">Cast and crew</a>
            <a className="button edit warning">Edit</a>
            <a className="button delete alert" onClick={() => this.props.delete(this.props.category, this.props.movie)}>Delete</a>
          </div>
          <Route path={`/movies/${category}/${movie.id}/credits`} render={() => 
              <MovieCredits cast={this.state.cast} crew={this.state.crew} fetched={this.state.fetched}/>
          }/>
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