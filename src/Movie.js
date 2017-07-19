import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'

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
      dropdownClass: 'hide',
      scoreClass: '',
    }
  }

  updateState = (newState) => {
    this.setState(newState)
  }

  renderInfo = (navProps, path) => {
      return (
        <div>
          <MovieInfo {...this.props} redir={`/movies/${this.props.category}`} fetched={this.state.fetched} movie={this.state.movie} updateState={this.updateState}/>
          <div className="expanded stacked-for-small radius button-group">
            <Link className="button credits-button" to={path.includes('credits') 
                ? `/movies/${this.props.category}/${this.props.movie.id}`
                : path+'/credits' }>Cast and crew
            </Link>
            <Link className="button edit warning" to={path.includes('edit') 
                ? `/movies/${this.props.category}/${this.props.movie.id}`
                : path+'/edit' }>Edit
            </Link>
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
    const movie = this.props.movie
    const watched_date = new Date(movie.watched_date)
    watched_date.setDate(watched_date.getDate()+1)
    const path = this.props.location.pathname
    const expanded = path.includes(movie.id)
    return (
      <li className="Movie">
          <div className="info">
            <Link className="info-item title" to={expanded ? `/movies/${this.props.category}` : `/movies/${this.props.category}/${movie.id}`}>
              <i className={`fa ${expanded ? 'fa-minus-square' : 'fa-plus-square'}`}></i> {movie.title}
            </Link>
            { movie.watched_date 
              ? <div className="info-item">{watched_date.toLocaleDateString("en-US", this.options)}</div>
              : <div className="info-item"></div>
            } 
            <div className="info-item">
              <span className={`score ${this.state.scoreClass}`} onClick={(ev) => {
                  ev.persist()
                  if(!this.state.scoreClass) {
                    this.setState({scoreClass: 'hide', dropdownClass: ''}, () => 
                      ev.target.nextSibling.focus()
                    )
                  }
                } }>
                {movie.score 
                  ? `${movie.score}`
                  : '-'}
              </span>
              <select name="score" className={this.state.dropdownClass} onChange={(ev) => {
                  this.props.updateScore(movie, this.props.category, ev.target.value)
                  this.setState({scoreClass: '', dropdownClass: 'hide'})
                }} onBlur={() => {
                  this.setState({scoreClass: '', dropdownClass: 'hide'})
                }} defaultValue={movie.score}>
                <option value="">-</option>
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
          <Route path={`/movies/:category/${movie.id}`} render={(navProps) => {
            this.props.getMovieInfo(movie, '', this.updateState) 
            if(this.state.fetched) return this.renderInfo(navProps, path)
            return <div></div>
          }}/>
      </li>
    )
  }
}

export default Movie