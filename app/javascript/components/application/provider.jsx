import React, { useContext, createContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { getIsAuthenticated } from "../user/selectors";
import Queue from "../../libs/queue";

import {
  selectModules,
  selectNetworkStatus,
  selectUserModules
} from "./selectors";
import { setNetworkStatus } from "./action-creators";

const Context = createContext();

const ApplicationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const modules = useSelector(state => selectModules(state));
  const userModules = useSelector(state => selectUserModules(state));
  const online = useSelector(state => selectNetworkStatus(state));
  const authenticated = useSelector(state => getIsAuthenticated(state));

  const handleNetworkChange = isOnline => {
    dispatch(setNetworkStatus(isOnline));
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
    if (online && authenticated) {
      Queue.online = online && authenticated;
      Queue.dispatch = dispatch;
    }
  }, [online, authenticated]);

  return (
    <Context.Provider value={{ modules, userModules, online }}>
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
