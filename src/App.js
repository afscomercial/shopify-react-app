import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Callback, Main } from './containers';
import {AuthContextProvider} from './context'

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Switch>
          <Route path={'/callback'} component={Callback} />
          <Route path={'/'} component={Main} />
        </Switch>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
