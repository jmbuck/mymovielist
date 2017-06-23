import React, { Component } from 'react';

import './Main.css';
import Sidebar from './Sidebar'

class Main extends Component {
  render() {
    return (
      <div className="Main">
        <Sidebar />
      </div>
    );
  }
}

export default Main;