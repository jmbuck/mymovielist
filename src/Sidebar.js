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
              <button className="button success">Add New</button>
            </Link>
              <div className="lists">
                <Link to="/movies/completed" className="completed">
                  <button className="button" type="button">Completed Movies</button>
                </Link>
                <Link to="/movies/ptw" className="ptw">
                  <button className="button" type="button">Plan To Watch</button>
                </Link>
                <Link to="/movies/dropped" className="dropped">
                  <button className="button" type="button">Dropped Movies</button>
                </Link>
                <SignOut signOut={signOut} />
              </div>
          </div>
      </div>
    )
}

export default Sidebar;