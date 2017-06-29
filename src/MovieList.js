import React, { Component } from 'react';

import './MovieList.css';

class MovieList extends Component {
  render() {
    return (
      <div className="MovieList">
        {this.props.list}!!!
      </div>
    );
  }
}

export default MovieList;
