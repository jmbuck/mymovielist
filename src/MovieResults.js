import React, { Component } from 'react';

import './MovieResults.css';
import { movieKey } from './keys'

class MovieResults extends Component {
    constructor(props) {
        super(props)
        this.state = {
            results: [],
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('new props')
        if(this.props.location !== nextProps.location) {
            const query = nextProps.match.params.query

            if(query) {
                console.log(query)
                fetch(`https://api.themoviedb.org/3/search/movie?api_key=${movieKey}&query=${query}`)
                    .then(response => response.json())
                    .then(movies => {
                        console.log(movies)
                        this.setState({ results: movies.results })
                    }
                )
            }
        }
    }

    clickResult = (ev) => {
        console.log(ev.target)
    }

    renderResult = (result, i) => {
        return (
            <li key={i} onClick={this.clickResult}>{result.title}</li>
        )
    }

    render() {
        return (
            <div className="MovieResults">
                <ul>
                    {this.state.results.map((result, i) => this.renderResult(result, i))}
                </ul>
            </div>
        );
    }
}

export default MovieResults;