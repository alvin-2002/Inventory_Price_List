
import { Route, Switch } from 'react-router-dom';
import HomePage from '../app/features/Home/HomePage';
import Login from '../app/features/Account/Login';
import Register from '../app/features/Account/Register';

function App() {
  return (
    <Switch>
      <Route exact path='/'>
        <HomePage />
      </Route>
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
    </Switch>
  );
}

export default App;
