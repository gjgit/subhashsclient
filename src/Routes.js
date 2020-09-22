/* eslint-disable linebreak-style */
import React, { useContext } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import { RouteWithLayout } from './components';

import {
  Dashboard as DashboardView,
  ProductList as ProductListView,
  UserList as UserListView,
  Typography as TypographyView,
  Icons as IconsView,
  Account as AccountView,
  Settings as SettingsView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  Home as HomeView
} from './views';

import { AuthContext } from './context/auth';

const Routes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Switch>
      {user && <Route component={DashboardView} exact path="/" />}
      {user && <Route component={HomeView} exact path="/home" />}
      {user && <Route component={UserListView} exact path="/users" />}
      {user && <Route component={ProductListView} exact path="/products" />}
      {user && <Route component={TypographyView} exact path="/typography" />}
      {user && <Route component={IconsView} exact path="/icons" />}
      {user && <Route component={AccountView} exact path="/account" />}
      {user && <Route component={SettingsView} exact path="/settings" />}
      {user && user.role === 'SuperAdmin' ? (
        <Route component={SignUpView} exact path="/sign-up" />
      ) : user && user.role === 'Admin' ? (
        <Route component={SignUpView} exact path="/sign-up" />
      ) : (
        <RouteWithLayout component={SignUpView} exact path="/sign-up" />
      )}
      <RouteWithLayout component={SignInView} exact path="/sign-in" />
      <Route component={NotFoundView} exact path="/not-found" />
      <Redirect to="/sign-in" />
    </Switch>
  );
};

export default Routes;
