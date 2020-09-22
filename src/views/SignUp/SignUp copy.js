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
  CircularProgress,
  Container,
  Card,
  CardHeader,
  CardContent,
  CardActions
} from '@material-ui/core';
import { TextField, Radios } from 'mui-rff';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import StarIcon from '@material-ui/icons/StarBorder';

import { Form } from 'react-final-form';

import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../../context/auth';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none'
    }
  },
  grid: {
    height: '100%'
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[700]
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2)
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
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingBototm: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(2)
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
  textField: {
    marginTop: theme.spacing(2)
  },
  radio: {
    margin: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

const SignUp = props => {
  const context = useContext(AuthContext);
  const user = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const { history } = props;
  const classes = useStyles();
  const handleBack = () => {
    history.goBack();
  };
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const tiers = [
    {
      title: 'Free',
      price: '0',
      description: [
        '10 users included',
        '2 GB of storage',
        'Help center access',
        'Email support'
      ],
      buttonText: 'Sign up for free',
      buttonVariant: 'outlined'
    },
    {
      title: 'Pro',
      subheader: 'Most popular',
      price: '15',
      description: [
        '20 users included',
        '10 GB of storage',
        'Help center access',
        'Priority email support'
      ],
      buttonText: 'Get started',
      buttonVariant: 'contained'
    },
    {
      title: 'Enterprise',
      price: '30',
      description: [
        '50 users included',
        '30 GB of storage',
        'Help center access',
        'Phone & email support'
      ],
      buttonText: 'Contact us',
      buttonVariant: 'outlined'
    }
  ];
  const getLocalItem = localStorage.getItem('jwtToken');
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      if (localStorage.getItem('jwtToken') !== null) {
        if (user && user.user.role === 'SuperAdmin') {
          console.log('SuperAdmin' + user);
          props.history.push('/');
        } else if (user && user.user.role === 'Admin') {
          console.log('Admin' + user);
          props.history.push('/');
        } else {
          console.log('normal' + user);
          context.login(userData);
          props.history.push('/');
        }
      } else {
        context.login(userData);
        props.history.push('/');
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
      <Grid
        className={classes.grid}
        container
        justify="center"
        alignItems="center">
        <Grid className={classes.content} item lg={1} xs={12}>
          <div className={classes.contentHeader}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
          </div>
        </Grid>
        <Grid className={classes.content} item lg={8} xs={12}>
          <Typography className={classes.title} variant="h2">
            Create new account
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Use your email to create new account
          </Typography>
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
                <Container maxWidth="md" component="main">
                  <Grid container spacing={5} alignItems="flex-end">
                    {tiers.map(tier => (
                      // Enterprise card is full width at sm breakpoint
                      <Grid
                        item
                        key={tier.title}
                        xs={12}
                        sm={tier.title === 'Enterprise' ? 12 : 6}
                        md={4}>
                        <Card>
                          <CardHeader
                            title={tier.title}
                            subheader={tier.subheader}
                            titleTypographyProps={{ align: 'center' }}
                            subheaderTypographyProps={{ align: 'center' }}
                            action={tier.title === 'Pro' ? <StarIcon /> : null}
                            className={classes.cardHeader}
                          />
                          <CardContent>
                            <div className={classes.cardPricing}>
                              <Typography
                                component="h2"
                                variant="h3"
                                color="textPrimary">
                                ${tier.price}
                              </Typography>
                              <Typography variant="h6" color="textSecondary">
                                /mo
                              </Typography>
                            </div>
                            <ul>
                              {tier.description.map(line => (
                                <Typography
                                  component="li"
                                  variant="subtitle1"
                                  align="center"
                                  key={line}>
                                  {line}
                                </Typography>
                              ))}
                            </ul>
                          </CardContent>
                          <CardActions>
                            <Button
                              fullWidth
                              variant={tier.buttonVariant}
                              color="primary">
                              {tier.buttonText}
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Container>
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
                  Sign up now
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

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);
