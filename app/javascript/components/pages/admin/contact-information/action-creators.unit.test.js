// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<ContactInformation /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["saveContactInformation"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check that 'saveContactInformation' action creator returns the correct object", () => {
    jest.spyOn(generate, "messageKey").mockReturnValue(4);

    const args = {
      body: {
        prop1: "prop-1"
      },
      saveMethod: "update",
      message: "Updated successfully"
    };

    const expectedAction = {
      type: actions.SAVE_CONTACT_INFORMATION,
      api: {
        path: RECORD_PATH.contact_information,
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
          redirect: `/admin/${RECORD_PATH.contact_information}`
        }
      }
    };

    expect(actionsCreators.saveContactInformation(args)).toEqual(expectedAction);

    jest.resetAllMocks();
  });
});
