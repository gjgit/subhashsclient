import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../../context/auth';

const RouteWithLayout = props => {
  const { component: Component, ...rest } = props;
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={matchProps =>
        user ? <Redirect to="/" /> : <Component {...matchProps} />
      }
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
