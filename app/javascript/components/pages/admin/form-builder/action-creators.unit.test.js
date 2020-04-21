import { stub } from "../../../../test";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<FormsBuilder /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["clearSelectedForm", "fetchForm", "saveForm"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check the 'clearSelectedForm' action creator to return the correct object", () => {
    const expected = {
      type: actions.CLEAR_SELECTED_FORM
    };

    expect(actionCreators.clearSelectedForm()).to.deep.equal(expected);
  });

  it("should check the 'saveForm' action creator to return the correct object", () => {
    stub(generate, "messageKey").returns(4);

    const args = {
      body: { name: { en: "form section 1" } },
      message: "Saved successfully"
    };

    const expected = {
      type: actions.SAVE_FORM,
      api: {
        path: "forms",
        method: "POST",
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
          redirectToEdit: true,
          redirect: "/admin/forms"
        }
      }
    };

    expect(actionCreators.saveForm(args)).to.deep.equal(expected);
  });

  afterEach(() => {
    if (generate.messageKey.restore) {
      generate.messageKey.restore();
    }
  });
});
