import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  FormLabel,
  Button
} from '@material-ui/core';
import { Form } from 'react-final-form';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { TextField, Radios, Checkboxes } from 'mui-rff';
import { AuthContext } from '../../../../context/auth';

const useStyles = makeStyles(() => ({
  root: {}
}));

const AccountDetails = props => {
  const { className, ...rest } = props;
  const [open, setOpen] = useState();

  const { user } = useContext(AuthContext);
  const username = user.username;
  const classes = useStyles();
  const {
    loading,
    data: { getCurrentUserDetailsForUpdation: datas }
  } = useQuery(FETCH_USER_DETAILS_QUERY, {
    variables: {
      username
    }
  });
  if (datas) {
    console.log(datas.username);
    console.log(user.username);
  }

  const onSubmit = async values => {
    //alert(values.packages.length);
    if (values.packages.length < datas.packages.length) {
      alert('you are not allowed to downgrade');
    }
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader subheader="The information can be edited" title="Profile" />
      <Divider />
      <CardContent>
        <Grid container>
          <Form
            onSubmit={onSubmit}
            initialValues={datas}
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
                  disabled="true"
                />
                <TextField
                  className={classes.textField}
                  required={true}
                  fullWidth
                  label="Email address"
                  name="email"
                  variant="outlined"
                  type="text"
                  disabled="true"
                />
                <FormLabel component="legend" className={classes.title}>
                  Choose Your Packages
                </FormLabel>
                <Checkboxes
                  name="packages"
                  required={true}
                  data={[
                    { label: 'Free', value: 'free' },
                    { label: 'Pro', value: 'pro' },
                    { label: 'Enterprise', value: 'enterprise' }
                  ]}
                />
                {/* {getLocalItem && user.user.role === 'SuperAdmin' && (
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
                  )}*/}
                {/*{getLocalItem && user.user.role === 'Admin' && (
                    <Radios
                      className={classes.radio}
                      name="role"
                      radioGroupProps={{ row: true }}
                      data={[
                        { label: 'Admin', value: 'Admin' },
                        { label: 'Client', value: 'Client' }
                      ]}
                    />
                    )} */}
                <Button
                  type="submit"
                  className={classes.signUpButton}
                  disabled={submitting || pristine}
                  color="primary"
                  fullWidth
                  size="large"
                  variant="contained">
                  Save details
                </Button>{' '}
                {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
              </form>
            )}
          />
        </Grid>
      </CardContent>
      <Divider />
      <CardActions>
        <Button color="primary" variant="contained">
          Save details
        </Button>
      </CardActions>
    </Card>
  );
};

const FETCH_USER_DETAILS_QUERY = gql`
  query($username: String!) {
    getCurrentUserDetailsForUpdation(username: $username) {
      username
      email
      packages
    }
  }
`;

AccountDetails.propTypes = {
  className: PropTypes.string
};

export default AccountDetails;
