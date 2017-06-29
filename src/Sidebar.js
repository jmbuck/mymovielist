import React from 'react';
import { Link } from 'react-router-dom'
import './Sidebar.css';

const Sidebar = () => 
{
    return (
      <div className="Sidebar">
          <div className="nav">
            <Link to="/new" className="new">
              <button className="new">Add New</button>
            </Link>
              <div className="lists">
                <Link to="/complete" className="complete">
                  <button type="button" className="complete">Completed Movies</button>
                </Link>
                <Link to="/downloaded" className="downloaded">
                  <button type="button" className="downloaded">Downloaded Movies</button>
                </Link>
                <Link to="/ptw" className="downloaded">
                  <button type="button" className="ptw">Plan To Watch</button>
                </Link>
                <Link to="/dropped" className="dropped">
                  <button type="button" className="dropped">Dropped Movies</button>
                </Link>
              </div>
          </div>
      </div>
    )
}

export default Sidebar;