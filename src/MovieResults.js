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
            page: 0,
        }
    }

    componentWillMount() {
        const query = this.props.match.params.query
        const page = this.props.match.params.page
        this.fetchMovies(query, page)
    }

    componentWillReceiveProps(nextProps) {
        const oldQuery = this.props.match.params.query
        const query = nextProps.match.params.query
        const oldPage = this.props.match.params.page
        const page = nextProps.match.params.page
        if(oldQuery !== query || oldPage !== page) {
            this.setAdded(false)
            this.fetchMovies(query, page)
        }
    }

    fetchMovies = (query, page) => {
        if(query) {
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=${movieKey}&query=${query}&page=${page}`)
                .then(response => {
                    if(response.status === 422) {
                        this.props.history.push(`/new/${this.props.match.params.query}/1`)
                        return
                    }
                    return response.json()})
                .then(movies => {
                    if(!movies) return
                    this.setState({ results: movies.results, page, totalPages: movies.total_pages }, () => {
                        if(page > movies.total_pages) {
                            this.props.history.push(`/new/${this.props.match.params.query}/1`)
                        }
                    })
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
            this.props.history.push(`/new/${this.props.match.params.query}/${this.props.match.params.page}`)
            this.setAdded(true)
        }
    }

    moveBack = () => {
        this.props.history.push(`/new/${this.props.match.params.query}/${parseInt(this.props.match.params.page, 10)-1}`)
    }

    moveForward = () => {
        this.props.history.push(`/new/${this.props.match.params.query}/${parseInt(this.props.match.params.page, 10)+1}`)
    }

    render() {
        return (
            <div className="MovieResults">
                {
                this.state.results && this.state.results.length > 0 
                    ? <ul>{this.state.results.map((result, i) => <MovieResult 
                                                                    key={i} index={i} query={this.props.match.params.query} 
                                                                    page={this.props.match.params.page} 
                                                                    movie={result} 
                                                                    setAdded={this.setAdded} 
                                                                    {...this.props} 
                                                                 />)}</ul>
                    : <div>No results found.</div>
                }
                {
                this.state.added 
                    ? <div className="added">Movie added to list successfully!</div>
                    : <div className="added"></div>
                }

                {(() => {
                    if(this.props.match.params.page > 1) {
                        return <button type="button" onClick={this.moveBack}>Back</button>
                }})()}
                {(() => {  
                    if(this.props.match.params.page < this.state.totalPages) {
                        return <button type="button" onClick={this.moveForward}>Forward</button>
                }})()}
                <span>Page {this.props.match.params.page} of {this.state.totalPages}</span>

                <Route path={`/new/${this.props.match.params.query}/${this.props.match.params.page}/:index`} render={navProps => {
                    
                    const movie = this.state.results[navProps.match.params.index]
                    if(!movie) return <Redirect to={`/new/${this.props.match.params.query}/${this.props.match.params.page}`} />

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