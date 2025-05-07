// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { MODULES, RECORD_PATH, SAVE_METHODS, METHODS } from "../../config";
import { ENQUEUE_SNACKBAR, generate } from "../notifier";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<ReportsForm /> - action-creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["saveReport", "clearSelectedReport"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check that 'saveReport' action creator returns the correct object", () => {
    jest.spyOn(generate, "messageKey").mockReturnValue(4);

    const args = {
      id: 1,
      body: {
        data: { en: "test" },
        record_type: RECORD_PATH.cases,
        module_id: MODULES.CP
      },
      saveMethod: SAVE_METHODS.new,
      message: "Saved successfully"
    };

    const expectedAction = {
      type: actions.SAVE_REPORT,
      api: {
        path: RECORD_PATH.reports,
        method: METHODS.POST,
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
          redirect: `/${RECORD_PATH.reports}`
        }
      }
    };

    expect(actionsCreators.saveReport(args)).toEqual(expectedAction);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
