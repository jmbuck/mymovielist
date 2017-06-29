import React, { Component } from 'react';

import './MovieForm.css';

class MovieForm extends Component {
  
    handleSubmit = (ev) => {
        ev.preventDefault()
        const category = ev.target.category.value
        if(category) {
            this.props.addMovie(category, {title: ev.target.title.value})
            ev.target.reset()
        }
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
                    <button type="submit">Add Movie</button>
                </form>
            </div>
        );
    }
}

export default MovieForm;
