import React, { Component } from 'react';

import './Movie.css';

class Movie extends Component {
  render() {
    return (
        <li>
            <span>Title - {this.props.movie.title} </span>
            <span>Overview - {this.props.movie.overview}</span>
        </li>
    )
  }
}

export default Movie;