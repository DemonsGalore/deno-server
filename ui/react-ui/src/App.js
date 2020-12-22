import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

const Home = () => {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

const About = () => {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

const App = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  }
  const decrement = () => {
    setCount(count - 1);
  }

  return (
    <>
      <p>You clicked {count} times</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>

          <hr />

          {/*
            A <Switch> looks through all its children <Route>
            elements and renders the first one whose path
            matches the current URL. Use a <Switch> any time
            you have multiple routes, but you want only one
            of them to render at a time
          */}
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
