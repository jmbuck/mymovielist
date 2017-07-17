import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import './MovieResult.css'
import MovieInfo from './MovieInfo'
import MovieForm from './MovieForm'

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

  updateState = (newState, path) => {
    this.setState(newState, () => this.props.history.push(path))
  }

  renderResultInfo = (navProps) => {
    return (
        <div>
          <MovieInfo {...this.props} 
            {...navProps} 
            redir={`/movies/new/${this.props.match.params.query}/${this.props.match.params.page}`} 
            movie={this.state.movie}
            fetched={this.state.fetched}
            updateState={this.updateState} 
          />
          <MovieForm 
            category="completed" 
            movie={this.state.movie} 
            handleSubmit={this.props.handleSubmit}
            edit={false} 
            redir={`/movies/new/${this.props.match.params.query}/${this.props.match.params.page}`}
            setAdded={this.props.setAdded}
          />
        </div>
    )
  }

  render() {
    const movie = this.props.movie
    return (
      <div className="MovieResult">
        <li className="item">
          <div className="info" onClick={this.handleClick}>
            {this.props.movie.title} ({movie.release_date 
                                      ? (new Date(movie.release_date)).toLocaleDateString("en-us", {year: 'numeric'})
                                      : 'Unknown'})
            <button className="button success" type="button" onClick={(ev) => {
              this.props.getMovieInfo(movie, '', (data) => {
                movie.runtime = data.movie.runtime
                this.props.handleSubmit(movie, ev, false, true)
                this.props.setAdded(true)
              })
            }}>Quick add to completed</button>
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