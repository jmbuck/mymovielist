import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import './MovieForm.css'
import MovieResults from './MovieResults'

class MovieForm extends Component {
  
    handleSubmit = (ev) => {
        ev.preventDefault()
        const query = encodeURI(ev.target.title.value)
        console.log(query)
        this.props.history.push(`/new/${query}`)
        ev.target.reset()
    }

    render() {
        return (
            <div className="MovieForm">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Movie title" name="title"/>
                    <button type="submit">Find Movie</button>
                </form>
                <Route path="/new/:query" render={(navProps) => <MovieResults {...this.props} {...navProps} />}/>
            </div>
        );
    }
}

export default MovieForm;
