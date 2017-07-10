import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

import './MovieList.css';
import Movie from './Movie'

class MovieList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //0 is alphabetical, 1 is by date, 2 is by score
      sortBy: 2,
      ascending: true,
    }
  }

  formatDuration = (totalTime) => {
    let minutes = totalTime
    let hours = Math.floor(minutes / 60) 
    minutes = minutes % 60
    let days = Math.floor(hours / 24) 
    hours = hours % 24
    let output = ""
    if(days) output += `${days} days, `
    if(hours) output += `${hours} hours, `
    if(minutes) {
      output += `${minutes} minutes`
    } else {
      //Cut out ending comma and space
      output = output.substr(0, output.length-2)
    }
    return output
  }

  calculateStats = (movies, stats) => {
    const keys = Object.keys(movies)
    stats.total = keys.length
    let totalTime = 0;
    let totalWithTime = 0;
    let totalScore = 0;
    let totalWithScore = 0;
    keys.map(movieId => {
      const movie = movies[movieId]
      if(movie.runtime) {
        totalTime += parseInt(movie.runtime, 10)
        totalWithTime++;
      } 
      if(movie.score) {
        totalScore += movie.score
        totalWithScore++;
      } 
    })
    stats.totalTime = this.formatDuration(totalTime)
    stats.meanTime = this.formatDuration(Math.floor(totalTime / totalWithTime))
    stats.meanScore = (totalScore / totalWithScore).toFixed(2)
  }

  sortMovies = (movies, a, b) => {
    switch(this.state.sortBy) {
      case 0: //Alphabetical
        if(this.state.ascending) {
          return movies[a].title < movies[b].title ? -1 : movies[a].title > movies[b].title
        } else {
          return movies[b].title < movies[a].title ? -1 : movies[b].title > movies[a].title
        }
      case 1: //Watch date
        if(this.state.ascending) { //recent first
          return movies[b].watched_date < movies[a].watched_date ? -1 : movies[b].watched_date > movies[a].watched_date
        } else {
          return movies[a].watched_date < movies[b].watched_date ? -1 : movies[a].watched_date > movies[b].watched_date
        }
      case 2: //Score
        if(this.state.ascending) { //highest first
          return movies[b].score - movies[a].score
        } else {
          return movies[a].score - movies[b].score
        }
      default:
        return movies[a].title < movies[b].title ? -1 : movies[a].title > movies[b].title
    }
  }

  renderList = (category) => {
    const movies = this.props.movies[category]
    const stats = {}

    if(!movies) return <div></div>
    this.calculateStats(movies, stats)

    return (
      <div className="list">
        <div className="stats">
          <div>Total movies: {stats.total}</div>
          <div>Total runtime: {stats.totalTime}</div>
          <div>Mean runtime: {stats.meanTime}</div>
          {category !== 'ptw' ? <div>Mean score: {stats.meanScore}</div> : <div></div>}
        </div>
        <ul>
          <li className="header">
            <div onClick={() => {
              this.setState({ sortBy: 0, ascending: !this.state.ascending })
              }}><strong>TITLE</strong></div>
            <div onClick={() => {
              this.setState({ sortBy: 1, ascending: !this.state.ascending })
            }}><strong>DATE WATCHED</strong></div>
            <div onClick={() => {
              this.setState({ sortBy: 2, ascending: !this.state.ascending })
            }}><strong>SCORE</strong></div>
          </li>
            {Object.keys(movies).sort((a, b) => this.sortMovies(movies, a, b)).map(movieId => <Movie 
                                                  key={movieId} 
                                                  category={category} 
                                                  movie={movies[movieId]} 
                                                  {...this.props}
                                                />)}
        </ul>
      </div>
    )
  }

  render() {
    return (
      <div className="MovieList">
        <Switch>
            <Route path="/movies/completed" render={() => this.renderList('completed')} />
            <Route path="/movies/downloaded" render={() => this.renderList('downloaded')} />
            <Route path="/movies/ptw" render={() => this.renderList('ptw')} />
            <Route path="/movies/dropped" render={() => this.renderList('dropped')} />
        </Switch>
      </div>
    )
  }
}

export default MovieList;
