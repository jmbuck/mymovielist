import React from 'react'
import { Route, Switch } from 'react-router-dom'

import './Main.css'
import Sidebar from './Sidebar'
import MovieSearch from './MovieSearch'
import MovieList from './MovieList'

const Main = (props) => 
{
    return (
      <div className="Main">
        <Sidebar signOut={props.signOut}/>     
        <Switch>
            <Route path="/movies/new" render={(navProps) => <MovieSearch {...props} {...navProps} />}/>
            <Route path="/movies/completed" render={(navProps) => <MovieList {...props} list="completed" {...navProps} />}/>
            <Route path="/movies/ptw" render={(navProps) => <MovieList {...props} list="ptw" {...navProps} />}/>
            <Route path="/movies/dropped" render={(navProps) => <MovieList {...props} list="dropped" {...navProps} />}/>
            <Route path="/movies" render={(navProps) => {
              return (<div className="lists">
                  <MovieList {...props} list="completed" {...navProps} />
                  <MovieList {...props} list="ptw" {...navProps} />
                  <MovieList {...props} list="dropped" {...navProps} /> 
                </div>)
            }}/>
        </Switch>
      </div>
    )
}

export default Main