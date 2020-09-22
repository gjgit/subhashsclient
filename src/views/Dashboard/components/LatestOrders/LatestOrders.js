import React, { useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import mockData from './data';
import { StatusBullet } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 800
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const statusColors = {
  delivered: 'success',
  pending: 'info',
  refunded: 'danger'
};

const LatestOrders = props => {
  const {
    loading,
    data: { getAllUsers: datas }
  } = useQuery(FETCH_USER_DETAILS_QUERY);
  let itemsToRender;
  if (datas) {
    itemsToRender = datas.map(item => {
      return (
        <TableRow hover key={item.id}>
          <TableCell>
            <Link as={Link} to={`/user/${item.id}`}>
              {item.username}
            </Link>
          </TableCell>
          <TableCell>{item.email}</TableCell>
          <TableCell>{moment(item.createdAt).format('DD/MM/YYYY')}</TableCell>
          <TableCell>{item.role}</TableCell>
        </TableRow>
      );
    });
  }
  const { className, ...rest } = props;

  const classes = useStyles();

  const [orders] = useState(mockData);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        action={
          <Button color="primary" size="small" variant="outlined">
            <Link as={Link} to={`/sign-up`}>
              New user
            </Link>
          </Button>
        }
        title="Users List"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{itemsToRender}</TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <Divider />
    </Card>
  );
};

const FETCH_USER_DETAILS_QUERY = gql`
  {
    getAllUsers {
      id
      username
      email
      createdAt
      role
    }
  }
`;

LatestOrders.propTypes = {
  className: PropTypes.string
};

export default LatestOrders;
