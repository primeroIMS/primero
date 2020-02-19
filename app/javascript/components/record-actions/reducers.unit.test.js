import { expect } from "chai";
import { fromJS } from "immutable";

import { reducers } from "./reducers";
import { SET_DIALOG, SET_DIALOG_PENDING } from "./actions";

describe("<RecordActions /> - Reducers", () => {
  it("should handle SET_DIALOG", () => {
    const defaultState = fromJS({
      requestApproval: false,
      pending: false
    });

    const payload = {
      dialog: "requestApproval",
      open: true
    };
    const expected = fromJS({
      requestApproval: true,
      pending: false
    });

    const action = {
      type: SET_DIALOG,
      payload
    };

    const newState = reducers.dialogs(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SET_DIALOG_PENDING", () => {
    const defaultState = fromJS({
      requestApproval: false,
      pending: false
    });

    const payload = {
      pending: true
    };

    const expected = fromJS({
      requestApproval: false,
      pending: true
    });

    const action = {
      type: SET_DIALOG_PENDING,
      payload
    };

    const newState = reducers.dialogs(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });
});
