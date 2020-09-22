import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  Link,
  Typography,
  Backdrop,
  CircularProgress
} from '@material-ui/core';
import { TextField, Radios } from 'mui-rff';
import { Form } from 'react-final-form';
import { AuthContext } from '../../context/auth';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

const Register = props => {
  const { OnSuccessClosethis } = props;
  const context = useContext(AuthContext);
  const user = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const getLocalItem = localStorage.getItem('jwtToken');
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      if (localStorage.getItem('jwtToken') !== null) {
        if (user && user.user.role === 'SuperAdmin') {
          console.log('SuperAdmin' + user);
          OnSuccessClosethis();
        } else if (user && user.user.role === 'Admin') {
          console.log('Admin' + user);
          OnSuccessClosethis();
        } else {
          console.log('normal' + user);
          context.login(userData);
          OnSuccessClosethis();
        }
      } else {
        setOpen(false);
        OnSuccessClosethis();
        context.login(userData);
      }
    },
    onError(err) {
      setOpen(false);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  const onSubmit = async values => {
    setOpen(!open);
    await sleep(300);
    setValues({ ...values, values });
    addUser();
  };

  return (
    <div className={classes.root}>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid className={classes.grid} container justify="center">
        <Grid item lg={8} xs={12}>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
              <form onSubmit={handleSubmit} noValidate>
                <TextField
                  className={classes.textField}
                  fullWidth
                  required={true}
                  label="User Name"
                  name="username"
                  variant="outlined"
                  type="text"
                  error={errors.username ? true : false}
                  helperText={errors.username ? errors.username : false}
                />
                <TextField
                  className={classes.textField}
                  required={true}
                  fullWidth
                  label="Email address"
                  name="email"
                  variant="outlined"
                  type="text"
                  error={errors.email ? true : false}
                  helperText={errors.email ? errors.email : false}
                />
                <TextField
                  className={classes.textField}
                  required={true}
                  fullWidth
                  label="Password"
                  name="password"
                  variant="outlined"
                  type="password"
                  error={errors.password ? true : false}
                  helperText={errors.password ? errors.password : false}
                />
                <TextField
                  className={classes.textField}
                  required={true}
                  fullWidth
                  label="Confrim password"
                  name="confirmPassword"
                  variant="outlined"
                  type="password"
                  error={errors.confirmPassword ? true : false}
                  helperText={
                    errors.confirmPassword ? errors.confirmPassword : false
                  }
                />
                {getLocalItem && user.user.role === 'SuperAdmin' && (
                  <Radios
                    className={classes.radio}
                    name="role"
                    radioGroupProps={{ row: true }}
                    data={[
                      { label: 'Super Admin', value: 'SuperAdmin' },
                      { label: 'Admin', value: 'Admin' },
                      { label: 'Client', value: 'Client' }
                    ]}
                  />
                )}
                {getLocalItem && user.user.role === 'Admin' && (
                  <Radios
                    className={classes.radio}
                    name="role"
                    radioGroupProps={{ row: true }}
                    data={[
                      { label: 'Admin', value: 'Admin' },
                      { label: 'Client', value: 'Client' }
                    ]}
                  />
                )}
                <Button
                  type="submit"
                  className={classes.signUpButton}
                  disabled={submitting || pristine}
                  color="primary"
                  fullWidth
                  size="large"
                  variant="contained">
                  Next
                </Button>{' '}
                <Typography color="textSecondary" variant="body1">
                  Have an account?{' '}
                  <Link component={RouterLink} to="/sign-in" variant="h6">
                    Sign in
                  </Link>
                </Typography>
              </form>
            )}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $role: String
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        role: $role
      }
    ) {
      id
      email
      username
      createdAt
      token
      role
    }
  }
`;

Register.propTypes = {
  history: PropTypes.object,
  OnSuccessClosethis: PropTypes.func
};

export default withRouter(Register);
