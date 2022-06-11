
import { Route, Switch } from 'react-router-dom';
import HomePage from '../app/features/Home/HomePage';
import Login from '../app/features/Account/Login';
import Register from '../app/features/Account/Register';
import NavBar from './NavBar';
import { Container, CssBaseline } from '@mui/material';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <CssBaseline />
      <NavBar />
      <Container sx={{mt: 4}}>
      <ToastContainer position="bottom-right" hideProgressBar theme='colored' />
        <Switch>
          <Route exact path='/'>
            <HomePage />
          </Route>
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
        </Switch>
      </Container>
    </>
  );
}

export default App;
