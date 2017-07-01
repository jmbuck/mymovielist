import React from 'react';
import { Link } from 'react-router-dom'
import './Sidebar.css';

const Sidebar = () => 
{
    return (
      <div className="Sidebar">
          <div className="nav">
            <Link to="/new" className="new">
              <button className="button success">Add New</button>
            </Link>
              <div className="lists">
                <Link to="/completed" className="completed">
                  <button className="button" type="button">Completed Movies</button>
                </Link>
                <Link to="/downloaded" className="downloaded">
                  <button className="button" type="button">Downloaded Movies</button>
                </Link>
                <Link to="/ptw" className="ptw">
                  <button className="button" type="button">Plan To Watch</button>
                </Link>
                <Link to="/dropped" className="dropped">
                  <button className="button" type="button">Dropped Movies</button>
                </Link>
              </div>
          </div>
      </div>
    )
}

export default Sidebar;