import { fromJS } from "immutable";

import { useMemoizedSelector } from "../../libs";
import { PENDING_TRANSITION_ALERTS } from "../../config";
import { getPendingTransitionToForm } from "../application/selectors";
import { currentUser } from "../user/selectors";

import { userInRecordList } from "./utils";

const usePendingTransitionAlerts = (record, primeroModule) => {
  const currentUserName = useMemoizedSelector(state => currentUser(state));
  const alertForms = useMemoizedSelector(state => getPendingTransitionToForm(state, primeroModule));

  return fromJS(
    Object.entries(PENDING_TRANSITION_ALERTS)
      .filter(
        ([transitionType, config]) =>
          alertForms.get(transitionType) && userInRecordList(record, config.pendingUsersField, currentUserName)
      )
      .map(([transitionType]) => ({ type: transitionType, form_unique_id: alertForms.get(transitionType) }))
  );
};

export default usePendingTransitionAlerts;
