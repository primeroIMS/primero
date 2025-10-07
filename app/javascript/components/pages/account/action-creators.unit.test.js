// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { RECORD_PATH, METHODS } from "../../../config";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("pages/account/action-creators.js", () => {
  beforeEach(() => {
    jest.spyOn(generate, "messageKey").mockReturnValue(4);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("properties", () => {
    let clone;

    beforeAll(() => {
      clone = { ...actionsCreators };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    ["fetchCurrentUser", "clearCurrentUser", "updateUserAccount"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(actionsCreators).toHaveProperty(property);
        delete clone[property];
      });
    });
  });

  it("should check that 'fetchCurrentUser' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.FETCH_CURRENT_USER,
      api: {
        path: `${RECORD_PATH.users}/1`
      }
    };

    expect(actionsCreators.fetchCurrentUser(1)).toEqual(expectedAction);
  });

  it("should check that 'clearCurrentUser' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.CLEAR_CURRENT_USER
    };

    expect(actionsCreators.clearCurrentUser()).toEqual(expectedAction);
  });

  it("should check that 'updateUserAccount' action creator returns the correct object", () => {
    const args = {
      id: 10,
      data: { prop1: "prop-1" },
      message: "Updated successfully"
    };

    const expectedAction = {
      type: actions.UPDATE_CURRENT_USER,
      api: {
        path: `${RECORD_PATH.users}/${args.id}`,
        method: METHODS.PATCH,
        body: { data: args.data },
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
          redirect: `/${RECORD_PATH.account}/${args.id}`
        }
      }
    };

    expect(actionsCreators.updateUserAccount(args)).toEqual(expectedAction);
  });
});
