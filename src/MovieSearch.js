import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import './MovieSearch.css'
import MovieResults from './MovieResults'

class MovieSearch extends Component {
  
    handleSubmit = (ev) => {
        ev.preventDefault()
        const query = ev.target.title.value.replace(/\/| /g, '+')
        this.props.history.push(`/movies/new/${query}/1`)
    }

    render() {
        return (
            <div className="MovieSearch">
                <form className="find-movie" onSubmit={this.handleSubmit}>
                    <div className="input-group">
                        <input className="input-group-field" type="text" required autoFocus placeholder="Movie title" name="title"/>
                        <div className="input-group-button">
                            <button className="button" type="submit">Find Movie</button>
                        </div>
                    </div>
                </form>
                <Route path="/movies/new/:query/:page" render={(navProps) => <MovieResults {...this.props} {...navProps} />}/>
            </div>
        );
    }
}

export default MovieSearch;