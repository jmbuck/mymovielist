import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

import './MovieResult.css'

class MovieResult extends Component {

  clickResult = (ev) => {
      this.props.setAdded(false)
      const path = `/new/${this.props.match.params.query}/${this.props.match.params.page}/${this.props.index}`
      if(this.props.location.pathname !== path) {
        this.props.history.push(path)
      } else {
        this.props.history.push(`/new/${this.props.match.params.query}/${this.props.match.params.page}`)
      }
  }
  
  handleSubmit = (movie, ev) => {
      ev.preventDefault()
      const category = ev.target.category.value
      movie.watched_date = ev.target.date.value
      movie.score = parseInt(ev.target.score.value, 10)

      this.props.addMovie(movie, category)
      this.props.history.push(`/new/${this.props.match.params.query}/${this.props.match.params.page}`)
      this.props.setAdded(true)
  }

  renderResultInfo = () => {
    const movie = this.props.movie
    if(!movie) return <Redirect to={`/new/${this.props.match.params.query}/${this.props.match.params.page}`} />

    const path = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    const date = new Date(movie.release_date)
    const options = {
        month: "long",
        year: "numeric",
        day: "numeric",
    }
    
    return (
        <div className="more-info">
            
            {/*Displays movie poster. If poster does not exist, show "poster does not exist" image*/
                movie.poster_path 
                ? <img src={path} alt="movie poster" />
                : <img src="http://static01.mediaite.com/med/wp-content/uploads/gallery/possilbe-movie-pitches-culled-from-the-mediaite-comments-section/poster-not-available1.jpg" alt="movie poster" />
            }
            <div className="not-poster">
              {
                  movie.release_date
                  ?  <div className="date">Release date: {date.toLocaleDateString("en-US", options)}</div>
                  : <div className="date">Unknown release date</div>
              }
                
              {
                  movie.overview 
                  ? <div className="synopsis">Synopsis: {movie.overview}</div>
                  : <div className="synopsis">No synopsis available</div>
              }
              
              <form onSubmit={(ev) => this.handleSubmit(movie, ev)}>
                <div className="add-movie">
                    <div className="category">
                      <input type="radio" name="category" value="completed" defaultChecked/>Completed<br/>
                      <input type="radio" name="category" value="ptw" />Plan to Watch<br/>
                      <input type="radio" name="category" value="dropped" />Dropped<br/>
                    </div>
                    <div className="optional">
                      Date watched (optional): <input type="date" name="date" />
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
        </div>
    )
  }

  render() {
    return (
      <div className="MovieResult">
        <li className="item">
          <div className="info" onClick={this.clickResult}>
            {this.props.movie.title} ({this.props.movie.release_date 
                                      ? (new Date(this.props.movie.release_date)).toLocaleDateString("en-us", {year: 'numeric'})
                                      : 'Unknown'})
          </div>
          <Route 
            path={`/new/${this.props.match.params.query}/${this.props.match.params.page}/${this.props.index}`} 
            render={this.renderResultInfo} 
          />
        </li>
      </div>
    )
  }
}

export default MovieResult;