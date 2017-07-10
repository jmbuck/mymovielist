import React from 'react';
import { Route, Switch } from 'react-router-dom'

import './Main.css';
import Sidebar from './Sidebar'
import MovieForm from './MovieForm'
import MovieList from './MovieList'

const Main = (props) => 
{
    return (
      <div className="Main">
        <Sidebar signOut={props.signOut}/>     
        <Switch>
            <Route path="/movies/new" render={(navProps) => <MovieForm {...props} {...navProps} />}/>
            <Route path="/movies/completed" render={(navProps) => <MovieList {...props} list="completed" {...navProps} />}/>
            <Route path="/movies/ptw" render={(navProps) => <MovieList {...props} list="ptw" {...navProps} />}/>
            <Route path="/movies/dropped" render={(navProps) => <MovieList {...props} list="dropped" {...navProps} />}/>
        </Switch>
      </div>
    )
}

export default Main;