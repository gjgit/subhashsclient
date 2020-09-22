/* eslint-disable linebreak-style */
import React, { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/styles';
import {
  AppBar,
  Toolbar,
  Badge,
  Hidden,
  IconButton,
  Avatar
} from '@material-ui/core';
import {
  deepOrange,
  deepPurple,
  lightGreen,
  yellow
} from '@material-ui/core/colors';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import StarIcon from '@material-ui/icons/Star';

import { AuthContext } from '../../../../context/auth';

const SmallAvatar = withStyles(theme => ({
  root: {
    width: 12,
    height: 12
  }
}))(Avatar);

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(0)
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginLeft: theme.spacing(1),
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500]
  }
}));

const Topbar = props => {
  const { user, logout } = useContext(AuthContext);
  const { className, onSidebarOpen, ...rest } = props;

  const classes = useStyles();

  const [notifications] = useState([]);

  return (
    <AppBar {...rest} className={clsx(classes.root, className)}>
      <Toolbar>
        <IconButton color="inherit" onClick={onSidebarOpen}>
          <MenuIcon />
        </IconButton>
        <RouterLink to="/account">
          <Badge
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            badgeContent={
              <StarIcon
                style={
                  user.role === 'SuperAdmin'
                    ? { color: yellow[500], width: 15 }
                    : user.role === 'Admin'
                    ? { color: lightGreen[500], width: 15 }
                    : { display: 'none' }
                }
              />
            }
            overlap="circle">
            <Avatar className={classes.small}>
              {user.username.slice(0, 1)}
            </Avatar>
          </Badge>
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={logout}>
            <InputIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
