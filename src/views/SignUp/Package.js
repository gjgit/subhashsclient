import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, withRouter } from 'react-router-dom';
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
import StarIcon from '@material-ui/icons/StarBorder';
import { Checkboxes } from 'mui-rff';
import { Form, Field } from 'react-final-form';
import { AuthContext } from '../../context/auth';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    marginTop: theme.spacing(2)
  },
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none'
    }
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  signUpButton: {
    alignItems: 'flex-start',
    justify: 'flex-end',
    direction: 'row'
  }
}));

const Package = props => {
  const { OnSuccessClosethis } = props;
  const context = useContext(AuthContext);
  const user = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
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
  const [values, setValues] = useState({});
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
      <Form
        onSubmit={onSubmit}
        validate={values => {
          const errors = {};
          if (!values.packages) {
            errors.packages = 'Required';
          }
          return errors;
        }}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit} noValidate>
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
                      <CardActions
                        style={{ display: 'flex', justifyContent: 'center' }}>
                        <Field
                          name="packages"
                          className={classes.cardHeader}
                          component="input"
                          type="checkbox"
                          value={tier.title}
                        />{' '}
                        <h3>Selct this</h3>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
                <Button
                  type="submit"
                  style={{ marginLeft: 'auto' }}
                  disabled={submitting || pristine}
                  color="primary"
                  variant="contained">
                  Next Step
                </Button>
              </Grid>
            </Container>

            <pre>{JSON.stringify(values, 0, 2)}</pre>
          </form>
        )}
      />
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

Package.propTypes = {
  history: PropTypes.object,
  OnSuccessClosethis: PropTypes.func
};

export default withRouter(Package);
