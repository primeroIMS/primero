import React from "react";
import LoginLayout from "./LoginLayout";
import { Route } from 'react-router-dom';

const LoginLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={matchProps => (
      <LoginLayout>
        <Component {...matchProps} />
      </LoginLayout>
    )} />
  )
}

export default LoginLayoutRoute;
