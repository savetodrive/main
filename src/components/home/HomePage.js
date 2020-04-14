import React from 'react';
import { Link } from 'react-router';

const HomePage = () => (
  <div className="jumbotron">
    <h1> Nepal Admin</h1>
    <p>React, Redux and React Router</p>
    <Link to="about" className="btn btn-primary"> Learn More</Link>
  </div>
);
export default HomePage;
