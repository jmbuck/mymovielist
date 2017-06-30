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
            <Route path="/completed" render={(navProps) => <MovieList {...props} list="completed" {...navProps} />}/>
            <Route path="/downloaded" render={(navProps) => <MovieList {...props} list="downloaded" {...navProps} />}/>
            <Route path="/ptw" render={(navProps) => <MovieList {...props} list="ptw" {...navProps} />}/>
            <Route path="/dropped" render={(navProps) => <MovieList {...props} list="dropped" {...navProps} />}/>
        </Switch>
      </div>
    )
}

export default Main;