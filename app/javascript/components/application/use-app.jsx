// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useContext, createContext } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";

import useMemoizedSelector from "../../libs/use-memoized-selector";
import useConnectivityStatus from "../connectivity/use-connectivity-status";

import { getAppData } from "./selectors";

const Context = createContext();

const ApplicationProvider = ({ children }) => {
  const { online, fieldMode } = useConnectivityStatus();

  const appData = useMemoizedSelector(state => getAppData(state), isEqual);

  return <Context.Provider value={{ ...appData, online, fieldMode }}>{children}</Context.Provider>;
};

ApplicationProvider.displayName = "ApplicationProvider";

ApplicationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

const useApp = () => useContext(Context);

export { ApplicationProvider, useApp };
