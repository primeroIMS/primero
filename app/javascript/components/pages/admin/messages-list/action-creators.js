import { RECORD_PATH } from "../../../../config";
import actions from "./actions";
export const fetchMessages = params => {
  const { data } = params || {};

  return {
    type: actions.FETCH_MESSAGES,
    api: {
      path: RECORD_PATH.messages,
      params: data
    }
  };
};

// TODO make this handle updates (if we want that as functionality)
export const saveMessage = ({message}) => {
  return {
    type: actions.SAVE_MESSAGE,
    api: {
      path: RECORD_PATH.messages,
      method: "POST",
      body: message
    }
  };
};
