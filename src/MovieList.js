import React, { Component } from 'react';
import { Route } from 'react-router-dom'

import './MovieList.css';
import Movie from './Movie'

class MovieList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //0 is ascending alphabetical, 1 is descending alphabetical
      //2 is ascending date, 3 is descending date
      //4 is ascending score, 5 is descending score
      sortBy: 0,
    }
  }

  formatDuration = (totalTime) => {
    let minutes = totalTime
    let hours = Math.floor(minutes / 60) 
    minutes = minutes % 60
    let days = Math.floor(hours / 24) 
    hours = hours % 24
    let output = ""
    if(days) output += `${days} ${days === 1 ? 'day' : 'days'}, `
    if(hours) output += `${hours} ${hours === 1 ? 'hour' : 'hours'}, `
    if(minutes) {
      output += `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
    } else {
      //Cut out ending comma and space
      output = output.substr(0, output.length-2)
    }
    return output
  }

  calculateStats = (movies, stats) => {
    const keys = Object.keys(movies)
    stats.total = keys.length
    let totalTime = 0, totalBaseTime = 0, totalWithTime = 0,
        totalScore = 0, totalWithScore = 0
    for(const movieId of keys) {
      const movie = movies[movieId]
      if(movie.runtime) {
        totalTime += movie.runtime * ((movie.rewatches ? parseInt(movie.rewatches, 10) : 0) + 1)
        totalBaseTime += movie.runtime
        totalWithTime++
      }
      if(movie.score) {
        totalScore += movie.score
        totalWithScore++;
      } 
    }
    stats.totalTime = this.formatDuration(totalTime)
    stats.meanTime = this.formatDuration(Math.floor(totalBaseTime / totalWithTime))
    totalWithScore ? stats.meanScore = (totalScore / totalWithScore).toFixed(2) : stats.meanScore = 0
  }

  sortMovies = (movies, a, b) => {
    const titleA = movies[a].title.toUpperCase().replace(/(^(The|An|A) )/i, '')
    const titleB = movies[b].title.toUpperCase().replace(/(^(The|An|A) )/i, '')
    switch(this.state.sortBy) {
      case 0: //Alphabetical
        return titleA < titleB ? -1 : titleA > titleB
      case 1:
        return titleB < titleA ? -1 : titleB > titleA
      case 2: //Watch date
          //recent first is ascending
          return movies[b].watched_date < movies[a].watched_date ? -1 : movies[b].watched_date > movies[a].watched_date
      case 3:
          return movies[a].watched_date < movies[b].watched_date ? -1 : movies[a].watched_date > movies[b].watched_date
      case 4: //Score
          //highest first is ascending
          return movies[b].score - movies[a].score
      case 5:
          return movies[a].score - movies[b].score
      default:
        return titleA < titleB ? -1 : titleA > titleB
    }
  }

  renderList = (category) => {
    const movies = this.props.movies[category]

    if(!movies) return <div></div>
    const stats = {}
    this.calculateStats(movies, stats)

    return (
      <div className="list-container">
        <ul className="list">
          <div className="list-title">
            <li className="item">
              <div className="title">{category === 'ptw' ? 'plan to watch' : category}</div>
              <div className="stats">
                <span>Total movies: {stats.total}</span>
                <span>Total runtime: {stats.totalTime ? stats.totalTime : '-'}</span>
                <span>Mean runtime: {stats.meanTime ? stats.meanTime : '-'}</span>
                {category !== 'ptw' ? <span>Mean score: {stats.meanScore ? stats.meanScore : '-'}</span> : <span></span>}
              </div>
            </li>
          </div>
          <div className="header">
            <li className="item">
              <div onClick={() => {
                if(this.state.sortBy === 0) this.setState({ sortBy: 1 })
                else this.setState({ sortBy: 0 })
                }}><strong>TITLE</strong></div>
              <div onClick={() => {
                if(this.state.sortBy === 2) this.setState({ sortBy: 3 })
                else this.setState({ sortBy: 2 })
              }}><strong>DATE WATCHED</strong></div>
              <div onClick={() => {
                if(this.state.sortBy === 4) this.setState({ sortBy: 5 })
                else this.setState({ sortBy: 4 })
              }}><strong>SCORE</strong></div>
            </li>
          </div>
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
        <Route render={() => this.renderList(this.props.list)} />
      </div>
    )
  }
}

export default MovieList;
