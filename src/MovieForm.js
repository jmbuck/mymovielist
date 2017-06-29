import React, { Component } from 'react';

import './MovieForm.css';

class MovieForm extends Component {
  
    handleSubmit = (ev) => {
        ev.preventDefault()
        this.props.addMovie({title: ev.target.title.value})
    }

    render() {
        return (
            <div className="MovieForm">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Movie title" name="title"/>
                    <button type="submit">Add Movie</button>
                </form>
            </div>
        );
    }
}

export default MovieForm;
