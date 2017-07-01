import React, { Component } from 'react';

import './Movie.css';

class Movie extends Component {

  handleClick = (ev) => {
     this.props.history.push(`/${this.props.category}/${this.props.movie.id}`)
  }

  render() {
    return (
        <li className="item" onClick={this.handleClick}>
            <div>{this.props.movie.title}</div>
            <div>{this.props.movie.watched_date}</div>
            <div>
              {this.props.movie.score 
                ? `Score: ${this.props.movie.score}`
                : ''}
            </div>
            <button type="button" onClick={() => this.props.delete(this.props.category, this.props.movie)}>Delete</button>
        </li>
    )
  }
}

export default Movie;