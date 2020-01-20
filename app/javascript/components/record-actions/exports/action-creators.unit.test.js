import { expect } from "chai";
import sinon from "sinon";
import configureStore from "redux-mock-store";

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
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch(actionCreators.saveExport({ data }, message));

    expect(dispatch).to.have.been.calledWithMatch({
      api: {
        body: { data },
        method: "POST",
        path: "exports",
        successCallback: {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message
          }
        }
      },
      type: actions.EXPORT
    });
  });
});
