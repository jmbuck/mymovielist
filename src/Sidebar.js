import React from 'react'
import { NavLink } from 'react-router-dom'

import './Sidebar.css'
import SignOut from './SignOut'

const Sidebar = ({ signOut }) => 
{
    return (
      <div className="Sidebar">
        <div className="nav-wrapper">
          <div className="nav">
            <NavLink to="/movies/new" className="new">
              <button className="button">Find Movies</button>
            </NavLink>
            <NavLink to="/movies/completed" className="completed">
              <button className="button" type="button">Completed Movies</button>
            </NavLink>
            <NavLink to="/movies/ptw" className="ptw">
              <button className="button" type="button">Plan To Watch</button>
            </NavLink>
            <NavLink to="/movies/dropped" className="dropped">
              <button className="button" type="button">Dropped Movies</button>
            </NavLink>
          </div>
        </div>
        <SignOut signOut={signOut} />
      </div>
    )
}

export default Sidebar