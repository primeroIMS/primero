import React, { useContext, createContext } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as Selectors from "./selectors";

const Context = createContext();

export const ApplicationProvider = ({ children }) => {
  const modules = useSelector(state => Selectors.selectModules(state));
  const userModules = useSelector(state => Selectors.selectUserModules(state));

  return (
    <Context.Provider value={{ modules, userModules }}>
      {children}
    </Context.Provider>
  );
};

ApplicationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useApp = () => useContext(Context);
