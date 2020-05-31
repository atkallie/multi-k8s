import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Fib from './Fib';
import OtherPage from './OtherPage';


function App() {
    return (
        <Router>
            <div className="App">
                <Link to="/">Home</Link>
                <br/>
                <Link to="/otherpage/">Other Dummy Page</Link>
                <div>
                    <Route exact path="/" component={Fib} />
                    <Route exact path="/otherpage/" component={OtherPage} />
                </div>
            </div>
        </Router>
    );
}

export default App;
