import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

import './MovieList.css';
import Movie from './Movie'

class MovieList extends Component {

  renderList = (category) => {
    const movies = this.props.movies[category]

    if(!movies) return <ul></ul>

    return (
        <ul>
            {Object.keys(movies).map(movieId => <Movie 
                                                  key={movieId} 
                                                  category={category} 
                                                  movie={movies[movieId]} 
                                                  {...this.props}
                                                />)}
        </ul>
    )
  }

  render() {
    return (
      <div className="MovieList">
        <Switch>
            <Route path="/completed" render={() => this.renderList('completed')} />
            <Route path="/downloaded" render={() => this.renderList('downloaded')} />
            <Route path="/ptw" render={() => this.renderList('ptw')} />
            <Route path="/dropped" render={() => this.renderList('dropped')} />
        </Switch>
      </div>
    )
  }
}

export default MovieList;
