import React from 'react';
import { Route } from 'react-router-dom';
import { RouteProps } from './Route.props';

const PublicRoute = ({ children, ...props }: RouteProps) => {
  return <Route {...props} render={() => children} />;
};

export default PublicRoute;
