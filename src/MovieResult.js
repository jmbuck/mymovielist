import React, { Component } from 'react';

import './MovieResult.css';

class MovieResult extends Component {

  clickResult = () => {
      this.props.history.push(`/new/${this.props.query}/${this.props.index}`)
  }

  render() {
    return (
        <li onClick={this.clickResult}>{this.props.movie.title}</li>
    )
  }
}

export default MovieResult;