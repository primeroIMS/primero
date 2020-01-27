import { expect } from "../../../test";
import { ENQUEUE_SNACKBAR } from "../../notifier";

import actions from "./actions";
import * as actionCreators from "./action-creators";

describe("<RecordActions /> - exports/action-creators", () => {
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
    const returnObject = actionCreators.saveExport({ data }, message);
    const expected = {
      type: actions.EXPORT,
      api: {
        path: "exports",
        method: "POST",
        body: { data },
        successCallback: {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message,
            options: returnObject.api.successCallback.payload.options
          }
        }
      }
    };

    expect(returnObject).to.not.be.undefined;
    expect(returnObject).to.deep.equals(expected);
  });
});
