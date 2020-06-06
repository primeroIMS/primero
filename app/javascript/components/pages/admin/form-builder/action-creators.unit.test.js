import { stub } from "../../../../test";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<FormsBuilder /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    [
      "clearSelectedForm",
      "fetchForm",
      "reorderFields",
      "saveForm",
      "setSelectedField",
      "setSelectedSubform",
      "updateSelectedField",
      "updateSelectedSubform"
    ].forEach(property => {
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
      api: [{
        path: "forms",
        method: "POST",
        body: args.body,
      }]
    };

    expect(actionCreators.saveForm(args)).to.deep.equal(expected);
  });

  afterEach(() => {
    if (generate.messageKey.restore) {
      generate.messageKey.restore();
    }
  });
});
