import React from 'react'
import AppLayout from './AppLayout'
import { Route } from 'react-router-dom';

const AppLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={() => (
      <AppLayout>
        <Component {...rest} />
      </AppLayout>
    )} />
  )
}
export default AppLayoutRoute;
