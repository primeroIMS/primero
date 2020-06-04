import { stub } from "../../../../test";
import { RECORD_PATH, SAVE_METHODS, METHODS } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<LookupsForm /> - action-creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["clearSelectedLookup", "fetchLookup", "saveLookup"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check that 'fetchLookup' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.FETCH_LOOKUP,
      api: {
        path: `${RECORD_PATH.lookups}/1`
      }
    };

    expect(actionsCreators.fetchLookup(1)).to.deep.equal(expectedAction);
  });

  it("should check that 'saveLookup' action creator returns the correct object", () => {
    stub(generate, "messageKey").returns(4);

    const args = {
      id: 1,
      body: {
        prop1: "prop-1"
      },
      saveMethod: SAVE_METHODS.update,
      message: "Saved successfully"
    };

    const expectedAction = {
      type: actions.SAVE_LOOKUP,
      api: {
        path: `${RECORD_PATH.lookups}/1`,
        method: METHODS.PATCH,
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
          redirectWithIdFromResponse: false,
          redirect: `/admin/${RECORD_PATH.lookups}/1`
        }
      }
    };

    expect(actionsCreators.saveLookup(args)).to.deep.equal(expectedAction);
  });

  afterEach(() => {
    if (generate.messageKey.restore) {
      generate.messageKey.restore();
    }
  });
});
