import React from 'react';
import { Link } from 'react-router-dom'

import './Sidebar.css';
import SignOut from './SignOut'

const Sidebar = ({ signOut }) => 
{
    return (
      <div className="Sidebar">
        <div className="nav">
          <Link to="/movies/new" className="new">
            <button className="button success">Find Movies</button>
          </Link>
          <Link to="/movies/completed" className="completed">
            <button className="button" type="button">Completed Movies</button>
          </Link>
          <Link to="/movies/ptw" className="ptw">
            <button className="button" type="button">Plan To Watch</button>
          </Link>
          <Link to="/movies/dropped" className="dropped">
            <button className="button" type="button">Dropped Movies</button>
            </Link>
        </div>
        <SignOut signOut={signOut} />
      </div>
    )
}

export default Sidebar;