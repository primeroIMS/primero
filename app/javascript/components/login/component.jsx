import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { NAME } from "./config";
import IdpSelection from "./components/idp-selection";
import LoginForm from "./components/login-form";
import { selectUseIdentityProvider } from "./selectors";

const Container = ({ dialogRef, formRef, modal }) => {
  const useIdentity = useSelector(state => selectUseIdentityProvider(state));
  const LoginComponent = useIdentity ? IdpSelection : LoginForm;

  return <LoginComponent modal={modal} formRef={formRef} dialogRef={dialogRef} />;
};

Container.displayName = NAME;

Container.defaultProps = {
  modal: false
};

Container.propTypes = {
  dialogRef: PropTypes.object,
  formRef: PropTypes.object,
  modal: PropTypes.bool
};

export default Container;
