import React, { useState, useContext } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  IconButton,
  Link,
  Typography,
  Backdrop,
  CircularProgress
} from '@material-ui/core';
import { TextField } from 'mui-rff';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Form } from 'react-final-form';

import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../../context/auth';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(10),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    justifyContent: 'center'
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

const SignIn = props => {
  const context = useContext(AuthContext);
  const { history } = props;
  const classes = useStyles();
  const handleBack = () => {
    history.goBack();
  };

  const [values, setValues] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      setOpen(false);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  const onSubmit = async values => {
    await sleep(300);
    setOpen(!open);
    setValues({ ...values, values });
    loginUser();
  };

  return (
    <div className={classes.root}>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid
        className={classes.grid}
        container
        justify="center"
        alignItems="center">
        <Grid className={classes.content} item lg={5} xs={12}>
          <Typography className={classes.title} variant="h2">
            Sign in
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Sign in with your username to login
          </Typography>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, form, submitting, pristine }) => (
              <form onSubmit={handleSubmit} noValidate>
                <TextField
                  className={classes.textField}
                  required={true}
                  fullWidth
                  label="Username"
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
                  label="Password"
                  name="password"
                  variant="outlined"
                  type="password"
                  error={errors.password ? true : false}
                  helperText={errors.password ? errors.password : false}
                />
                <Button
                  type="submit"
                  className={classes.signInButton}
                  disabled={submitting || pristine}
                  color="primary"
                  fullWidth
                  size="large"
                  variant="contained">
                  Sign in now
                </Button>
                <Typography color="textSecondary" variant="body1">
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/sign-up" variant="h6">
                    Sign up
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

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
      role
    }
  }
`;

SignIn.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignIn);
