import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

import './MovieResult.css'

class MovieResult extends Component {

  clickResult = (ev) => {
      this.props.setAdded(false)
      const path = `/movies/new/${this.props.match.params.query}/${this.props.match.params.page}/${this.props.index}`
      if(this.props.location.pathname !== path) {
        this.props.history.push(path)
      } else {
        this.props.history.push(`/movies/new/${this.props.match.params.query}/${this.props.match.params.page}`)
      }
  }
  
  handleSubmit = (movie, ev) => {
      ev.preventDefault()
      const category = ev.target.category.value
      movie.watched_date = ev.target.date.value
      const score = ev.target.score.value
      score ? movie.score = parseInt(score, 10) : movie.score = 0

      this.props.addMovie(movie, category)
      this.props.history.push(`/movies/new/${this.props.match.params.query}/${this.props.match.params.page}`)
      this.props.setAdded(true)
  }

  renderResultInfo = () => {
    const movie = this.props.movie
    if(!movie) return <Redirect to={`/movies/new/${this.props.match.params.query}/${this.props.match.params.page}`} />

    const path = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    const date = new Date(movie.release_date)
    const options = {
        month: "long",
        year: "numeric",
        day: "numeric",
    }

    let today = new Date()
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
  
    if(dd<10) dd = '0'+dd
    if(mm<10) mm = '0'+mm
    today = `${yyyy}-${mm}-${dd}`
    
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
            path={`/movies/new/${this.props.match.params.query}/${this.props.match.params.page}/${this.props.index}`} 
            render={this.renderResultInfo} 
          />
        </li>
      </div>
    )
  }
}

export default MovieResult;