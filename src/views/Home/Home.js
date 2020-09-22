/* eslint-disable linebreak-style */
import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Input } from '@material-ui/core';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { PostCard } from './components';
import MaterialTable from 'material-table';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Home = () => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const searchHandler = text => {
    setSearchText(text);
  };

  const {
    data: { serachForandGetusers: remoteData }
  } = useQuery(FETCH_POSTS_QUERY, {
    variables: {
      searchText
    }
  });

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <div style={{ margin: '20px 10px' }}>
            <Input
              placeholder="Type username to search"
              onChange={e => searchHandler(e.target.value)}
              value={searchText}
            />
          </div>
          <MaterialTable
            title="Basic Search Preview"
            columns={[{ title: 'Username', field: 'username' }]}
            data={remoteData}
            options={{
              toolbar: false
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const FETCH_POSTS_QUERY = gql`
  query($username: String!) {
    serachForandGetusers(username: $username) {
      id
      email
      username
      createdAt
      role
    }
  }
`;

export default Home;
