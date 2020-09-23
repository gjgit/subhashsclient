import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { Main as MainLayout, Minimal as MinimalLayout } from '../../layouts';
import { CreateAndDisplayPackage } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Settings = () => {
  const classes = useStyles();

  return (
    <MainLayout>
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item md={12} xs={12}>
            <CreateAndDisplayPackage />
          </Grid>
        </Grid>
      </div>
    </MainLayout>
  );
};

export default Settings;
