import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

import './MovieResult.css'
import MovieInfo from './MovieInfo'

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
    let today = new Date()
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
  
    if(dd<10) dd = '0'+dd
    if(mm<10) mm = '0'+mm
    today = `${yyyy}-${mm}-${dd}`
    return (
        <div className>
          <MovieInfo {...this.props} 
            {...navProps} 
            redir={`/movies/new/${this.props.match.params.query}/${this.props.match.params.page}`} 
            movie={this.state.movie}
            fetched={this.state.fetched}
            updateState={this.updateState} />
          <form onSubmit={(ev) => this.handleSubmit(this.state.movie, ev)}>
            <div className="add-movie">
                <div className="category">
                  <input type="radio" name="category" value="completed" defaultChecked/>Completed<br/>
                  <input type="radio" name="category" value="ptw" />Plan to Watch<br/>
                  <input type="radio" name="category" value="dropped" />Dropped<br/>
                </div>
                <div className="others">
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