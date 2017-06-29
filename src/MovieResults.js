import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import './MovieResults.css'
import { movieKey } from './keys'
import MovieResult from './MovieResult'

class MovieResults extends Component {
    constructor(props) {
        super(props)
        this.state = {
            results: [],
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.location !== nextProps.location) {
            const query = nextProps.match.params.query

            if(query) {
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

    handleSubmit = (movie, ev) => {
        ev.preventDefault()
        const category = ev.target.category.value
        if(category) {
            this.props.addMovie(category, movie)
        }
    }

    render() {
        return (
            <div className="MovieResults">
                <ul>
                    {this.state.results.map((result, i) => <MovieResult key={i} index={i} query={this.props.match.params.query} movie={result} {...this.props} />)}
                </ul>
                <Route path={`/new/${this.props.match.params.query}/:index`} render={navProps => {
                    const movie = this.state.results[parseInt(navProps.match.params.index)]
                    const path = `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                    return (
                        <div className="result-info">
                            <img src={path} alt="movie poster" />
                            <form className="add-movie" onSubmit={(ev) => this.handleSubmit(movie, ev)}>
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
                    )
                }}/>
            </div>
        );
    }
}

export default MovieResults;