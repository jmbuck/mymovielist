import React, { Component } from 'react';

import './MovieResult.css';

class MovieResult extends Component {

  clickResult = () => {
      this.props.setAdded(false)
      this.props.history.push(`/new/${this.props.query}/${this.props.page}/${this.props.index}`)
  }

  render() {
    return (
        <li className="item" onClick={this.clickResult}>{this.props.movie.title}</li>
    )
  }
}

export default MovieResult;