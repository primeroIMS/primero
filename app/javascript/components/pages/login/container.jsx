import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { NAME } from "./config";
import IdpSelection from "./idp-selection";
import LoginForm from "./login-form";
import {
  selectUseIdentityProvider
} from "./selectors";

const Container = ({ match }) => {
  const { params } = match;
  console.log('params:', params);
  const useIdentity = useSelector(state => selectUseIdentityProvider(state));

  return (
    <>
      {useIdentity ? <IdpSelection /> : <LoginForm />}
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  match: PropTypes.object
};

export default withRouter(Container);
