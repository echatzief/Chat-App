import React from 'react';
import ReactDOM from 'react-dom';
import Entrance from './components/Entrance';
import MainFrame from './components/MainFrame'
import { BrowserRouter as Router, Route } from 'react-router-dom';


/*
  We make the routing.At the / page we render the Entrance and at the /main
  we render the MainFrame
*/
ReactDOM.render(
  <Router>
        <div>
          <Route exact path="/" component={Entrance} />
          <Route path="/main" component={MainFrame} />
        </div>
    </Router>
  , document.getElementById('root')
);
