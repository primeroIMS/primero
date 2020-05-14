import { stub } from "../../../test";
import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { EXPORT_URL } from "../../pages/export-list/constants";
import { EXPORT_DIALOG } from "../constants";
import { SET_DIALOG, SET_DIALOG_PENDING } from "..";

import actions from "./actions";
import * as actionCreators from "./action-creators";

describe("<RecordActions /> - exports/action-creators", () => {
  before(() => {
    stub(generate, "messageKey").returns(4);
  });
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["saveExport"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
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
    const returnObject = actionCreators.saveExport(
      { data },
      message,
      actionLabel,
      EXPORT_DIALOG
    );

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
            action: SET_DIALOG,
            payload: {
              dialog: EXPORT_DIALOG,
              open: false
            }
          },
          {
            action: SET_DIALOG_PENDING,
            payload: {
              pending: false
            }
          }
        ]
      }
    };

    expect(returnObject).to.not.be.undefined;
    expect(returnObject).to.deep.equals(expected);
  });

  after(() => {
    generate.messageKey.restore();
  });
});
