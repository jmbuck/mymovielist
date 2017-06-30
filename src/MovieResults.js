import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

import './MovieResults.css'
import { movieKey } from './keys'
import MovieResult from './MovieResult'

class MovieResults extends Component {
    constructor(props) {
        super(props)
        this.state = {
            results: [],
            added: false,
        }
    }

    componentWillMount() {
        const query = this.props.match.params.query
        this.fetchMovies(query)
    }

    componentWillReceiveProps(nextProps) {
        const oldQuery = this.props.match.params.query
        const query = nextProps.match.params.query
        if(oldQuery !== query) {
            this.setAdded(false)
            this.fetchMovies(query)
        }
    }

    fetchMovies = (query) => {
        if(query) {
            console.log('fetched')
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=${movieKey}&query=${query}`)
                .then(response => response.json())
                .then(movies => {
                    console.log(movies)
                    this.setState({ results: movies.results })
                }
            )
        }
    }

    setAdded = (value) => {
        this.setState({added: value})
    }

    handleSubmit = (movie, ev) => {
        ev.preventDefault()
        const category = ev.target.category.value
        if(category) {
            this.props.addMovie(category, movie)
            this.props.history.push(`/new/${this.props.match.params.query}`)
            this.setAdded(true)
        }
    }

    render() {
        return (
            <div className="MovieResults">
                {
                this.state.results.length > 0 
                    ? <ul>{this.state.results.map((result, i) => <MovieResult key={i} index={i} query={this.props.match.params.query} movie={result} setAdded={this.setAdded} {...this.props} />)}</ul>
                    : <div>No results found.</div>
                }
                {
                this.state.added 
                    ? <div className="added">Movie added to list successfully!</div>
                    : <div className="added"></div>
                }
                <Route path={`/new/${this.props.match.params.query}/:index`} render={navProps => {
                    const movie = this.state.results[navProps.match.params.index]
                    
                    if(!movie) return <Redirect to={`/new/${this.props.match.params.query}`} />
                    const path = `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                    const date = new Date(movie.release_date)
                    const options = {
                        month: "long",
                        year: "numeric",
                        day: "numeric",
                    }
                    return (
                        <div className="result-info">
                            
                            {/*Displays movie poster. If poster does not exist, show "poster does not exist" image*/
                                movie.poster_path 
                                ? <img src={path} alt="movie poster" />
                                : <img src="http://static01.mediaite.com/med/wp-content/uploads/gallery/possilbe-movie-pitches-culled-from-the-mediaite-comments-section/poster-not-available1.jpg" alt="movie poster" />
                            }

                            <div className="title">{movie.title}</div>
                            <div className="date">Release date: {date.toLocaleDateString("en-US", options)}</div>
                            
                            {
                                movie.overview 
                                ? <div className="synopsis">Synopsis: {movie.overview}</div>
                                : <div className="synopsis">No synopsis available.</div>
                            }
                            
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