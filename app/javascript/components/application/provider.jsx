import React, { useContext, createContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import * as Selectors from "./selectors";
import { setNetworkStatus } from "./action-creators";

const Context = createContext();

export const ApplicationProvider = ({ children }) => {
  const modules = useSelector(state => Selectors.selectModules(state));
  const userModules = useSelector(state => Selectors.selectUserModules(state));
  const online = useSelector(state => Selectors.selectNetworkStatus(state));
  const dispatch = useDispatch();

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

  return (
    <Context.Provider value={{ modules, userModules, online }}>
      {children}
    </Context.Provider>
  );
};

ApplicationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useApp = () => useContext(Context);
