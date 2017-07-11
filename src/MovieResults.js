import React, { Component } from 'react'

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

    fetched = false

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
                        this.props.history.push(`/movies/new/${this.props.match.params.query}/1`)
                        return
                    }
                    return response.json()})
                .then(movies => {
                    if(!movies) return
                    this.setState({ results: movies.results, page, totalPages: movies.total_pages }, () => {
                        if(page > movies.total_pages) {
                            this.props.history.push(`/movies/new/${this.props.match.params.query}/1`)
                        }
                        this.fetched = true
                    })
                }
            )
        }
    }

    setAdded = (value) => {
        this.setState({added: value})
    }

    moveBack = () => {
        this.props.history.push(`/movies/new/${this.props.match.params.query}/${parseInt(this.props.match.params.page, 10)-1}`)
    }

    moveForward = () => {
        this.props.history.push(`/movies/new/${this.props.match.params.query}/${parseInt(this.props.match.params.page, 10)+1}`)
    }

    render() {
        return (
            <div className="MovieResults">
                {
                this.state.added 
                    ? <div className="added">{this.props.message}</div>
                    : <div></div>
                }

                {
                this.state.results && this.state.results.length > 0
                    ? <ul>{this.state.results.map((result, i) => <MovieResult 
                                                                    key={i} 
                                                                    index={i}
                                                                    results={this.state.results}
                                                                    movie={result} 
                                                                    setAdded={this.setAdded} 
                                                                    {...this.props} 
                                                />)}</ul>
                    : this.fetched ? <div>No results found.</div> : <div>Searching...</div>
                }
                <div className="page">
                    {(() => {
                        if(this.props.match.params.page > 1) {
                            return <button className="button warning" type="button" onClick={this.moveBack}>{'<'}</button>
                    }})()}
                    {(() => {  
                        if(this.props.match.params.page < this.state.totalPages) {
                            return <button className="button warning" type="button" onClick={this.moveForward}>></button>
                    }})()}
                    <span className="page-number">Page {this.props.match.params.page} of {this.state.totalPages}</span>
                </div>
            </div>
        );
    }
}

export default MovieResults;