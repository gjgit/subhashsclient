import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { AccountDetails } from './components';
import { Main as MainLayout } from '../../layouts';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Account = () => {
  const classes = useStyles();

  return (
    <MainLayout>
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={12} md={6} xl={8} xs={12}>
            <AccountDetails />
          </Grid>
        </Grid>
      </div>
    </MainLayout>
  );
};

export default Account;
