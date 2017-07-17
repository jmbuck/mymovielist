import React from 'react';
import { Redirect } from 'react-router-dom'

import './MovieInfo.css';

const MovieInfo = ({movie, fetched, location, updateState, redir, getMovieInfo}) => 
{
    if(!fetched) {
      getMovieInfo(movie, location.pathname, updateState)
    }

    if(movie && fetched) {
        const path = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        const release_date = new Date(movie.release_date)
        release_date.setDate(release_date.getDate()+1)
        const options = {
            month: "long",
            year: "numeric",
            day: "numeric",
        }
        return (
        <div className="MovieInfo">
            <div className="main">
            {/*Displays movie poster. If poster does not exist, show "poster does not exist" image*/
                movie.poster_path 
                ? <img src={path} alt="movie poster" />
                : <img src="http://static01.mediaite.com/med/wp-content/uploads/gallery/possilbe-movie-pitches-culled-from-the-mediaite-comments-section/poster-not-available1.jpg" alt="movie poster" />
            }
            
            <div className="not-poster"> 
                
                {
                movie.rewatches 
                ? <div className="rewatches"># of rewatches: {movie.rewatches}</div> : <div className="rewatches"></div>
                }  

                <div className="credits-preview">
                {movie.directors ? <div>Director(s): {movie.directors}</div> : <div></div>}
                {movie.screenplay ? <div>Screenplay: {movie.screenplay}</div> : <div></div>}
                {movie.writers ? <div>Writer(s): {movie.writers}</div> : <div></div>} 
                {movie.starring ? <div>Starring: {movie.starring}</div> : <div></div>} 
                </div>

                {
                    movie.overview 
                    ? <div className="synopsis">Synopsis: {movie.overview}</div>
                    : <div className="synopsis">No synopsis available.</div>
                }

                {
                movie.tagline
                ? <div className="tagline">Tagline: {movie.tagline}</div>
                : <div className="tagline"></div>
                }
                {
                movie.release_date 
                ? <div className="date">Released: {release_date.toLocaleDateString("en-US", options)}</div>
                : <div className="date">Unknown release date</div>
                }
                
                {movie.runtime ? <div className="duration">Duration: {movie.runtime} minutes</div> : <div className="duration"></div>}
                {movie.budget ? <div className="budget">Budget: ${movie.budget.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</div> : <div className="budget"></div>}
                {movie.revenue ? <div className="revenue">Revenue: ${movie.revenue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</div> : <div className="revenue"></div>}

                {
                movie.genres.length > 0
                ? (
                    <div className="genres">Genres:&nbsp;
                    {
                        movie.genres.map((genre, i) => i !== movie.genres.length-1 ? <span key={i}>{genre.name}, </span> : <span key={i}>{genre.name}</span>)
                    }
                    </div>)
                : <div className="genres"></div>
                }

                {
                movie.imdb_id 
                ? <a href={`http://www.imdb.com/title/${movie.imdb_id}/`} target="_blank" rel="noopener noreferrer">IMDB Page</a>
                : <div></div>
                } 
            </div>
            </div>
        </div>
        )
    }
    return <Redirect to={redir} />
}

export default MovieInfo