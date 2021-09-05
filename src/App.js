import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Welcome from './components/Welcome'
import About from './components/About'
import Roadmap from './components/Roadmap'
import { BrowserRouter as Router, Switch } from "react-router-dom";


class App extends Component {
  
  render() {
    return (
      <>
        <Router>
          <Switch />
          <Navbar />
          <Home />
          <Welcome />
          <About />
          <Roadmap />
          </Router> 
      </>
    );
  }
}

export default App;
