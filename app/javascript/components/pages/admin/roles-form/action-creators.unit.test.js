// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<RolesForm /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["clearSelectedRole", "deleteRole", "fetchRole", "saveRole", "setCopyRole", "clearCopyRole"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check that 'fetchRole' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.FETCH_ROLE,
      api: {
        path: `${RECORD_PATH.roles}/10`
      }
    };

    expect(actionsCreators.fetchRole(10)).toEqual(expectedAction);
  });

  it("should check that 'saveRole' action creator returns the correct object", () => {
    jest.spyOn(generate, "messageKey").mockReturnValue(4);

    const args = {
      id: null,
      body: {
        prop1: "prop-1"
      },
      message: "Saved successfully"
    };

    const expectedAction = {
      type: actions.SAVE_ROLE,
      api: {
        path: RECORD_PATH.roles,
        method: "POST",
        body: args.body,
        successCallback: {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message: "Saved successfully",
            options: {
              key: 4,
              variant: "success"
            }
          },
          redirectWithIdFromResponse: true,
          redirect: `/admin/${RECORD_PATH.roles}`
        }
      }
    };

    expect(actionsCreators.saveRole(args)).toEqual(expectedAction);
  });

  it("should check that 'deleteRole' action creator returns the correct object", () => {
    jest.spyOn(generate, "messageKey").mockReturnValue(4);

    const args = {
      id: 10,
      message: "Deleted successfully"
    };

    const expectedAction = {
      type: actions.DELETE_ROLE,
      api: {
        path: `${RECORD_PATH.roles}/10`,
        method: "DELETE",
        successCallback: {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message: "Deleted successfully",
            options: {
              key: 4,
              variant: "success"
            }
          },
          redirectWithIdFromResponse: false,
          redirect: `/admin/${RECORD_PATH.roles}`
        }
      }
    };

    expect(actionsCreators.deleteRole(args)).toEqual(expectedAction);
  });

  it("should check that 'setCopyRole' action creator returns the correct object", () => {
    const payload = { name: "Copy of Test" };
    const expectedAction = {
      type: actions.SET_COPY_ROLE,
      payload
    };

    expect(actionsCreators.setCopyRole(payload)).toEqual(expectedAction);
  });

  it("should check that 'clearCopyRole' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.CLEAR_COPY_ROLE
    };

    expect(actionsCreators.clearCopyRole()).toEqual(expectedAction);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
