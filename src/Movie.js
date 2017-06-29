import React, { Component } from 'react';

import './Movie.css';

class Movie extends Component {
  render() {
    return (
        <li>
            <div>Title - {this.props.movie.title}</div>
            <div>Overview - {this.props.movie.overview}</div>
        </li>
    )
  }
}

export default Movie;