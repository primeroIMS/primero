import { fromJS } from "immutable";

import reducer from "./reducer";
import { SET_DIALOG, SET_DIALOG_PENDING } from "./actions";

describe("<RecordActions /> - Reducers", () => {
  it("should handle SET_DIALOG", () => {
    const defaultState = fromJS({
      dialog: "requestApproval",
      pending: false
    });

    const payload = {
      dialog: "requestApproval",
      open: true
    };
    const expected = fromJS({
      dialog: "requestApproval",
      pending: false,
      open: true
    });

    const action = {
      type: SET_DIALOG,
      payload
    };

    const newState = reducer.dialogs(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SET_DIALOG_PENDING", () => {
    const defaultState = fromJS({
      dialog: "requestApproval",
      pending: false
    });

    const payload = true;

    const expected = fromJS({
      dialog: "requestApproval",
      pending: true
    });

    const action = {
      type: SET_DIALOG_PENDING,
      payload
    };

    const newState = reducer.dialogs(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });
});
