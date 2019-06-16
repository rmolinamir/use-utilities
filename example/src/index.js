// Libraries
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

// Components (Example)
import CallbackQueue from './CallbackQueue'
import ThrottledAndOnScrollCallback from './ThrottledAndOnScrollCallback'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/use-callback-queue" component={CallbackQueue} />
      <Route exact path="/use-throttled-and-use-on-scroll-callback" component={ThrottledAndOnScrollCallback} />
      <Redirect to="/use-callback-queue" />
    </Switch>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById('root'))
