// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import LoadingIndicator from "../loading-indicator";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import usePushNotifications from "../push-notifications-toggle/use-push-notifications";
import { ROUTES } from "../../config";

import { NAME } from "./config";
import IdpSelection from "./components/idp-selection";
import LoginForm from "./components/login-form";
import { getLoading, getUseIdentityProvider } from "./selectors";

const Container = ({ modal }) => {
  const useIdentity = useMemoizedSelector(state => getUseIdentityProvider(state));
  const isLoading = useMemoizedSelector(state => getLoading(state));
  const location = useLocation();
  const isLoggingOut = location.pathname === ROUTES.logout;

  const LoginComponent = useIdentity ? IdpSelection : LoginForm;

  const { stopRefreshNotificationTimer } = usePushNotifications();

  useEffect(() => {
    if (!modal && isLoggingOut) {
      stopRefreshNotificationTimer();
    }
  }, []);

  if (isLoggingOut) {
    return false;
  }

  return (
    <LoadingIndicator loading={isLoading} hasData={!isLoading}>
      <LoginComponent modal={modal} />
    </LoadingIndicator>
  );
};

Container.displayName = NAME;

Container.defaultProps = {
  modal: false
};

Container.propTypes = {
  modal: PropTypes.bool
};

export default Container;
