import PropTypes from "prop-types";

import LoadingIndicator from "../loading-indicator";
import { useMemoizedSelector } from "../../libs";

import { NAME } from "./config";
import IdpSelection from "./components/idp-selection";
import LoginForm from "./components/login-form";
import { getLoading, getUseIdentityProvider } from "./selectors";

const Container = ({ dialogRef, formRef, modal }) => {
  const useIdentity = useMemoizedSelector(state => getUseIdentityProvider(state));
  const isLoading = useMemoizedSelector(state => getLoading(state));

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
