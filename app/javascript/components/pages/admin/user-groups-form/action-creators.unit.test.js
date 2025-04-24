// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<UserGroupsForm /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["fetchUserGroup", "saveUserGroup", "clearSelectedUserGroup"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check that 'fetchUserGroup' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.FETCH_USER_GROUP,
      api: {
        path: `${RECORD_PATH.user_groups}/10`
      }
    };

    expect(actionsCreators.fetchUserGroup(10)).toEqual(expectedAction);
  });

  it("should check that 'saveUserGroup' action creator returns the correct object", () => {
    jest.spyOn(generate, "messageKey").mockReturnValue(4);

    const args = {
      id: 10,
      body: {
        prop1: "prop-1"
      },
      saveMethod: "update",
      message: "Updated successfully"
    };

    const expectedAction = {
      type: actions.SAVE_USER_GROUP,
      api: {
        path: `${RECORD_PATH.user_groups}/10`,
        method: "PATCH",
        body: args.body,
        successCallback: {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message: args.message,
            options: {
              key: 4,
              variant: "success"
            }
          },
          redirectWithIdFromResponse: false,
          redirect: `/admin/${RECORD_PATH.user_groups}/10`
        }
      }
    };

    expect(actionsCreators.saveUserGroup(args)).toEqual(expectedAction);

    jest.resetAllMocks();
  });
});
