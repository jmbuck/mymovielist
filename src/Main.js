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
        <Sidebar />
        
        <Switch>
            <Route path="/new" render={(navProps) => <MovieForm {...props} {...navProps} />}/>
            <Route path="/complete" render={(navProps) => <MovieList list="complete" {...navProps} />}/>
            <Route path="/downloaded" render={(navProps) => <MovieList list="downloaded" {...navProps} />}/>
            <Route path="/ptw" render={(navProps) => <MovieList list="ptw" {...navProps} />}/>
            <Route path="/dropped" render={(navProps) => <MovieList list="dropped" {...navProps} />}/>
        </Switch>
      </div>
    )
}

export default Main;