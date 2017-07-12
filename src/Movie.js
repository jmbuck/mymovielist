import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import './Movie.css'
import MovieInfo from './MovieInfo'
import MovieCredits from './MovieCredits'
import MovieForm from './MovieForm'

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

  renderInfo = (navProps) => {
      return (
        <div>
          <MovieInfo {...this.props} redir={`/movies/${this.props.category}`} fetched={this.state.fetched} movie={this.state.movie} updateState={this.updateState}/>
          <div className="expanded stacked-for-small radius button-group">
            <a className="button credits-button">Cast and crew</a>
            <a className="button edit warning">Edit</a>
            <a className="button delete alert" onClick={() => this.props.deleteMovie(this.props.movie, this.props.category)}>Delete</a>
          </div>
          <Route path={`/movies/${this.props.category}/${this.props.movie.id}/credits`} render={() => 
            <MovieCredits cast={this.state.cast} crew={this.state.crew} fetched={this.state.fetched}/>
          }/>
          <Route path={`/movies/${this.props.category}/${this.props.movie.id}/edit`} render={(navProps) => 
            <MovieForm 
              {...navProps}
              category={this.props.category} 
              movie={this.state.movie} 
              handleSubmit={this.props.handleSubmit} 
              edit={true}
              redir={`/movies/${this.props.category}/${this.props.movie.id}`}
             />
          }/>
        </div>
      )
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