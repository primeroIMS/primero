import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import LoadingIndicator from "../loading-indicator";

import { NAME } from "./config";
import IdpSelection from "./components/idp-selection";
import LoginForm from "./components/login-form";
import { getLoading, getUseIdentityProvider } from "./selectors";

const Container = ({ dialogRef, formRef, modal }) => {
  const useIdentity = useSelector(state => getUseIdentityProvider(state));
  const isLoading = useSelector(state => getLoading(state));
  const LoginComponent = useIdentity ? IdpSelection : LoginForm;

  return (
    <LoadingIndicator loading={isLoading} hasData={!isLoading}>
      <LoginComponent modal={modal} formRef={formRef} dialogRef={dialogRef} />
    </LoadingIndicator>
  );
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
