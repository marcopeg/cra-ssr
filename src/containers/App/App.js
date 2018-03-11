/*
    eslint
        jsx-a11y/anchor-is-valid: off
*/

import React from 'react'
import { Route, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
// import logo from './logo.svg'
import './App.css'

// console.log(logo)

import Dashboard from '../Dashboard'
import Post from '../Post'

const App = () => (
    <div className="App">
        <Helmet>
            <html lang="en" />
            <title>[cra-ssr] server side rendering for create react app</title>
        </Helmet>
        <header className="App-header">
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
            <div>
                <Link to="/" style={{ color: '#fff' }}>Home</Link>
                {' | '}
                <Link to="/p/1" style={{ color: '#fff' }}>Product1</Link>
                {' | '}
                <Link to="/p/2" style={{ color: '#fff' }}>Product2</Link>
            </div>
        </header>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/p/:id" component={Post} />
    </div>
)

export default App
