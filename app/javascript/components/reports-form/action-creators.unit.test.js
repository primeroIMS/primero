import { stub } from "../../test";
import { MODULES, RECORD_PATH, SAVE_METHODS, METHODS } from "../../config";
import { ENQUEUE_SNACKBAR, generate } from "../notifier";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<ReportsForm /> - action-creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["saveReport", "clearSelectedReport"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check that 'saveReport' action creator returns the correct object", () => {
    stub(generate, "messageKey").returns(4);

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

    expect(actionsCreators.saveReport(args)).to.deep.equal(expectedAction);
  });

  afterEach(() => {
    if (generate.messageKey.restore) {
      generate.messageKey.restore();
    }
  });
});
