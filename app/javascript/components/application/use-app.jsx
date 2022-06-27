import { useContext, createContext, useMemo } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";

import { useMemoizedSelector } from "../../libs";
import useConnectivityStatus from "../connectivity/use-connectivity-status";

import { getAppData } from "./selectors";

const Context = createContext();

const ApplicationProvider = ({ children }) => {
  const { online } = useConnectivityStatus();

  const appData = useMemoizedSelector(state => getAppData(state), isEqual);

  const value = useMemo(() => ({ ...appData, online }), [online, appData]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

ApplicationProvider.displayName = "ApplicationProvider";

ApplicationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

const useApp = () => useContext(Context);

export { ApplicationProvider, useApp };
