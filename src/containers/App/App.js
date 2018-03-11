import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import logo from './logo.svg'
import './App.css'

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h5>
        <Link to="/" style={{ color: '#fff' }}>Home</Link>
        {' | '}
        <Link to="/p/1" style={{ color: '#fff' }}>Product1</Link>
        {' | '}
        <Link to="/p/2" style={{ color: '#fff' }}>Product2</Link>
      </h5>
    </header>
    <Route exact path="/" component={() => <div>HOME</div>} />
    <Route exact path="/p/:id" component={({match}) => <div>P: {match.params.id}</div>} />
  </div>
)

export default App
