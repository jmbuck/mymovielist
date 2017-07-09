import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

import './MovieList.css';
import Movie from './Movie'

class MovieList extends Component {

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
    let totalScore = 0;
    let totalScored = 0;
    keys.map(movieId => {
      const movie = movies[movieId]
      console.log(movie.runtime+' '+movie.title)
      if(movie.runtime) totalTime += parseInt(movie.runtime, 10)
      if(movie.score) {
        totalScore += movie.score
        totalScored++;
      } 
    })
    stats.totalTime = this.formatDuration(totalTime)
    stats.meanScore = (totalScore / totalScored).toFixed(2)
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
          {category !== 'ptw' ? <div>Mean score: {stats.meanScore}</div> : <div></div>}
        </div>
        <ul>
            {Object.keys(movies).map(movieId => <Movie 
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
