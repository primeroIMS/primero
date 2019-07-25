import * as Actions from "./actions";
import * as ActionCreators from "./action-creators";
import * as Selectors from "./selectors";

import { LOGIN, LOGOUT } from "../components/pages/login/actions";
import { SAVE_RECORD } from "../components/record-form/actions";

export const connectivityMiddleware = store => next => action => {
  if (true || !navigator.onLine) {
    const { type } = action;
    switch (type) {
      case SAVE_RECORD: {
          const { api } = action;
          store.dispatch(ActionCreators.offlineSaveRecord(api));
          return; // do not invoke the next action
        }
      case "Cases/RECORDS": {
          const { api } = action;
          store.dispatch(ActionCreators.offlineRecords(api));
          return; // do not invoke the next action
        }
    }
  }
  return next(action);
};

export const offlineEncryptionMiddleware = store => next => action => {
  const { type } = action;
  switch (type) {
    case LOGIN: {
      const state = store.getState();
      const salt = Selectors.selectOfflineEncryptionSalt(state);
      const { user_name, password } = action.api.body.user;
      store.dispatch(ActionCreators.calculateOfflineEncryption(salt, user_name, password));
      break;
    }
    case LOGOUT: {
      store.dispatch(ActionCreators.setOfflineEncryptionKey(null));
      break;
    }
  }
  return next(action);
};

export const offlineMiddleware = store => next => action => {
  return next(action);
};
