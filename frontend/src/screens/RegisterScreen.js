import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { register } from '../actions/userActions';
import FormContainer from '../components/FormContainer';
import { Button, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import isEmail from '../utils/validations/isEmail';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
}));

const RegisterScreen = ({ location, history }) => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const passwordsMatch = password === confirmPassword && password !== '';
  const isValidEmail = isEmail(email);

  useEffect(() => {
    if (userInfo) {
      console.log('userInfo', userInfo);
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (name.length < 4) {
      setMessage('Name invalid');
    } else if (!passwordsMatch) {
      setMessage('Password do not match');
    } else if (!isValidEmail) {
      setMessage('Email not valid');
    } else {
      dispatch(register(name, email, password));
    }
  };

  return (
    <FormContainer>
      {loading && <Loader />}
      <form className={classes.root} autoComplete="off">
        <Typography variant="h5" style={{ marginTop: '25px', textAlign: 'center' }} color="primary">
          Sign Up
        </Typography>
        <TextField
          required
          variant="outlined"
          id="name"
          label="Name"
          defaultValue="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          helperText={
            name.length > 0 && name.length < 4 ? 'Name  invalid: 4 character atleast' : null
          }
        />
        <TextField
          required
          variant="outlined"
          id="email"
          label="Email Address"
          defaultValue="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          helperText={!isValidEmail && email.length > 1 ? 'Invalid email' : null}
        />
        <TextField
          required
          variant="outlined"
          type="password"
          id="password"
          label="Password"
          defaultValue="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          required
          variant="outlined"
          type="password"
          id="confirmPassword"
          label="Confirm password"
          defaultValue="Enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {message && <Message severity="error">{message}</Message>}
        {error && <Message severity="error">{error}</Message>}
        <Button variant="contained" width="100px" color="primary" onClick={submitHandler}>
          Register
        </Button>
        <Grid item style={{ textAlign: 'center', paddingTop: '5px' }}>
          Have an Account?
          <span>
            <Link
              style={{ textDecoration: 'none' }}
              to={redirect ? `/login?redirect=${redirect}` : '/login'}
            >
              {' '}
              Login
            </Link>
          </span>
        </Grid>
      </form>
    </FormContainer>
  );
};

export default RegisterScreen;
