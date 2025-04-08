// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { EXPORT_URL } from "../../pages/export-list/constants";
import { EXPORT_DIALOG } from "../constants";
import { CLEAR_DIALOG } from "../../action-dialog";

import actions from "./actions";
import * as actionCreators from "./action-creators";

describe("<RecordActions /> - exports/action-creators", () => {
  beforeAll(() => {
    jest.spyOn(generate, "messageKey").mockReturnValue(4);
  });
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["saveExport"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check the 'saveExport' action creator to return the correct object, when creating an export", () => {
    const data = {
      format: "csv",
      record_type: "case",
      file_name: "export-for-today.csv",
      password: "mypassword"
    };
    const message = "Test message";
    const actionLabel = "Test action label";
    const returnObject = actionCreators.saveExport({ data }, message, actionLabel, EXPORT_DIALOG);

    const expected = {
      type: actions.EXPORT,
      api: {
        path: EXPORT_URL,
        method: "POST",
        body: { data },
        successCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message,
              options: {
                key: 4,
                variant: "success"
              },
              actionLabel,
              actionUrl: `/${EXPORT_URL}`
            }
          },
          {
            action: CLEAR_DIALOG
          }
        ]
      }
    };

    expect(returnObject).toBeDefined();
    expect(returnObject).toEqual(expected);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
