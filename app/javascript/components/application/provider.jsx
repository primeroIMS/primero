import { useContext, createContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { useI18n } from "../i18n";
import { useConnectivityStatus } from "../connectivity";
import { currentUser } from "../user/selectors";
import { useMemoizedSelector } from "../../libs";

import { fetchSandboxUI } from "./action-creators";
import {
  selectModules,
  selectUserModules,
  getApprovalsLabels,
  getDisabledApplication,
  getDemo,
  getLimitedConfigUI,
  getFirstUserModule
} from "./selectors";

const Context = createContext();

const ApplicationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const i18n = useI18n();
  const { online } = useConnectivityStatus();

  const modules = useMemoizedSelector(state => selectModules(state));
  const userModules = useMemoizedSelector(state => selectUserModules(state));
  const approvalsLabels = useMemoizedSelector(state => getApprovalsLabels(state, i18n.locale));
  const disabledApplication = useMemoizedSelector(state => getDisabledApplication(state));
  const demo = useMemoizedSelector(state => getDemo(state));
  const limitedProductionSite = useMemoizedSelector(state => getLimitedConfigUI(state));
  const currentUserName = useMemoizedSelector(state => currentUser(state));
  const firstUserModule = useMemoizedSelector(state => getFirstUserModule(state));

  useEffect(() => {
    dispatch(fetchSandboxUI());
  }, []);

  const value = {
    modules,
    userModules,
    online,
    approvalsLabels,
    disabledApplication,
    demo,
    currentUserName,
    limitedProductionSite,
    firstUserModule
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

ApplicationProvider.displayName = "ApplicationProvider";

ApplicationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

const useApp = () => useContext(Context);

export { ApplicationProvider, useApp };
