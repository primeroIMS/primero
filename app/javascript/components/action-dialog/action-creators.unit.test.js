// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { SET_DIALOG, SET_DIALOG_PENDING } from "./actions";
import * as actionCreators from "./action-creators";

describe("<RecordActions /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).toHaveProperty("setDialog");
    expect(creators).toHaveProperty("setPending");
    expect(creators).toHaveProperty("clearDialog");
    delete creators.setDialog;
    delete creators.setPending;
    delete creators.clearDialog;

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check that 'setDialog' action creator returns the correct object", () => {
    const args = {
      dialog: "REQUEST_APPROVAL_DIALOG",
      open: true
    };

    const expectedAction = {
      type: SET_DIALOG,
      payload: { dialog: "REQUEST_APPROVAL_DIALOG", open: true }
    };

    expect(actionCreators.setDialog(args)).toEqual(expectedAction);
  });

  it("should check that 'setPending' action creator returns the correct object", () => {
    const args = {
      pending: true
    };

    const expectedAction = {
      type: SET_DIALOG_PENDING,
      payload: { pending: true }
    };

    expect(actionCreators.setPending(args)).toEqual(expectedAction);
  });
});
