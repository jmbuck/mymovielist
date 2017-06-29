import React, { Component } from 'react';

import './Movie.css';

class Movie extends Component {
  render() {
    return (
        <li>{this.props.movie.title}</li>
    )
  }
}

export default Movie;