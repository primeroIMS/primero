import React, { useContext, createContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { getIsAuthenticated } from "../user/selectors";
import { fetchContactInformation } from "../pages/support/action-creators";
import Queue from "../../libs/queue";
import { enqueueSnackbar, closeSnackbar } from "../notifier";
import { useI18n } from "../i18n";

import {
  selectModules,
  selectNetworkStatus,
  selectUserModules,
  getApprovalsLabels,
  getDisabledApplication
} from "./selectors";
import { setNetworkStatus } from "./action-creators";

const Context = createContext();

const CONNECTED = "connected";
const CONNECTION_LOST = "connection_lost";

const ApplicationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const i18n = useI18n();

  const modules = useSelector(state => selectModules(state));
  const userModules = useSelector(state => selectUserModules(state));
  const online = useSelector(state => selectNetworkStatus(state));
  const authenticated = useSelector(state => getIsAuthenticated(state));
  const approvalsLabels = useSelector(state => getApprovalsLabels(state, i18n.locale));
  const disabledApplication = useSelector(state => getDisabledApplication(state));

  const handleNetworkChange = isOnline => {
    const snackbarType = isOnline ? "success" : "warning";
    const messageKey = isOnline ? CONNECTED : CONNECTION_LOST;
    const config = {
      ...(!isOnline && {
        persist: true,
        dense: true,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      }),
      messageKey,
      type: snackbarType
    };

    if (isOnline) {
      dispatch(closeSnackbar(CONNECTION_LOST));
    }

    dispatch(setNetworkStatus(isOnline));
    dispatch(enqueueSnackbar(null, config));
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("online", () => handleNetworkChange(true));
      window.addEventListener("offline", () => handleNetworkChange(false));
    }

    return () => {
      window.removeEventListener("online", () => handleNetworkChange(true));
      window.removeEventListener("offline", () => handleNetworkChange(false));
    };
  }, []);

  useEffect(() => {
    dispatch(fetchContactInformation());
  }, []);

  useEffect(() => {
    if (online && authenticated) {
      Queue.ready = online && authenticated;
      Queue.dispatch = dispatch;
    }
  }, [online, authenticated]);

  return (
    <Context.Provider value={{ modules, userModules, online, approvalsLabels, disabledApplication }}>
      {children}
    </Context.Provider>
  );
};

ApplicationProvider.displayName = "ApplicationProvider";

ApplicationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

const useApp = () => useContext(Context);

export { ApplicationProvider, useApp };
