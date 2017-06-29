import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import './MovieForm.css'
import MovieResults from './MovieResults'

class MovieForm extends Component {
  
    handleSubmit = (ev) => {
        ev.preventDefault()
        const category = ev.target.category.value 
        this.props.history.push(`/new/${ev.target.title.value}`)
        ev.target.reset()
    }

    render() {
        return (
            <div className="MovieForm">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Movie title" name="title"/>
                    <select name="category">
                        <option value="">-- Category --</option>
                        <option value="completed">Completed</option>
                        <option value="downloaded">Downloaded</option>
                        <option value="ptw">Plan to Watch</option>
                        <option value="dropped">Dropped</option>
                    </select>
                    <button type="submit">Find Movie</button>
                </form>
                <Route path="/new/:query" render={(navProps) => <MovieResults {...this.props} {...navProps} />}/>
            </div>
        );
    }
}

export default MovieForm;
