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
                    console.log(movies)
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
        movie.watched_date = ev.target.date.value
        movie.score = parseInt(ev.target.score.value, 10)
        
        this.props.addMovie(movie, category)
        this.props.history.push(`/new/${this.props.match.params.query}/${this.props.match.params.page}`)
        this.setAdded(true)
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
                    ? <div className="added">{this.props.message}</div>
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

                            {
                                movie.release_date
                                ?  <div className="date">Release date: {date.toLocaleDateString("en-US", options)}</div>
                                : <div className="date">Unknown release date</div>
                            }
                              
                            {
                                movie.overview 
                                ? <div className="synopsis">Synopsis: {movie.overview}</div>
                                : <div className="synopsis">No synopsis available</div>
                            }
                            
                            <form className="add-movie" onSubmit={(ev) => this.handleSubmit(movie, ev)}>
                                <input type="radio" name="category" value="completed" checked/>Completed<br/>
                                <input type="radio" name="category" value="ptw" />Plan to Watch<br/>
                                <input type="radio" name="category" value="dropped" />Dropped<br/>
                                Date watched (optional): <input type="date" name="date" />
                                <select name="score">
                                    <option value="">-- Score --</option>
                                    <option value="10">10</option>
                                    <option value="9">9</option>
                                    <option value="8">8</option>
                                    <option value="7">7</option>
                                    <option value="6">6</option>
                                    <option value="5">5</option>
                                    <option value="4">4</option>
                                    <option value="3">3</option>
                                    <option value="2">2</option>
                                    <option value="1">1</option>
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