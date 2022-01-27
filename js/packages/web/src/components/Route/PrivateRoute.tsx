import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { RouteProps } from './Route.props';

const PrivateRoute = ({ children, ...props }: RouteProps) => {
  // @FIXME: this should be changed for a more robust way of authentication
  // using {connect} = useWallet() causes disconnections upon refresh and unitended redirections
  const sessionAuth = window.sessionStorage.getItem('auth');
  const isAuth = () => sessionAuth === 'true';
  return (
    <Route
      {...props}
      render={({ location }) =>
        isAuth() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/auth',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
