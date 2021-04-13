import { useDispatch } from "react-redux";

import { useI18n } from "../i18n";
import { useConnectivityStatus } from "../connectivity";
import { currentUser } from "../user/selectors";
import { useMemoizedSelector } from "../../libs";

import {
  selectModules,
  selectUserModules,
  getApprovalsLabels,
  getDisabledApplication,
  getDemo,
  getLimitedConfigUI
} from "./selectors";

const useApp = () => {
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

  return {
    modules,
    userModules,
    online,
    approvalsLabels,
    disabledApplication,
    demo,
    currentUserName,
    limitedProductionSite
  };
};

export default useApp;
