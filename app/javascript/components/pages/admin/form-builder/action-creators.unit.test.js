import { stub } from "../../../../test";
import { generate } from "../../../notifier";

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
      api: [
        {
          path: "forms",
          method: "POST",
          body: args.body
        }
      ]
    };

    expect(actionCreators.saveForm(args)).to.deep.equal(expected);
  });

  it("should check the 'fetchForm' action creator to return the correct object", () => {
    const expected = {
      type: actions.FETCH_FORM,
      api: { path: "forms/1" }
    };

    expect(actionCreators.fetchForm(1)).to.deep.equal(expected);
  });

  it("should check the 'setSelectedField' action creator to return the correct object", () => {
    const expected = {
      type: actions.SET_SELECTED_FIELD,
      payload: { name: "field_1" }
    };

    expect(actionCreators.setSelectedField("field_1")).to.deep.equal(expected);
  });

  it("should check the 'setSelectedSubform' action creator to return the correct object", () => {
    const expected = {
      type: actions.SET_SELECTED_SUBFORM,
      payload: { id: 1 }
    };

    expect(actionCreators.setSelectedSubform(1)).to.deep.equal(expected);
  });

  it("should check the 'updateSelectedField' action creator to return the correct object", () => {
    const field = { name: "field_1", display_text: { en: "Field 1" } };
    const expected = {
      type: actions.UPDATE_SELECTED_FIELD,
      payload: { data: field }
    };

    expect(actionCreators.updateSelectedField(field)).to.deep.equal(expected);
  });

  it("should check the 'updateSelectedSubform' action creator to return the correct object", () => {
    const subform = { id: 1, name: { en: "Subform 1" } };
    const expected = {
      type: actions.UPDATE_SELECTED_SUBFORM,
      payload: { data: subform }
    };

    expect(actionCreators.updateSelectedSubform(subform)).to.deep.equal(
      expected
    );
  });

  it("should check the 'reorderFields' action creator to return the correct object", () => {
    const expected = {
      type: actions.REORDER_FIELDS,
      payload: { name: "field_1", order: 0, isSubform: true }
    };

    expect(actionCreators.reorderFields("field_1", 0, true)).to.deep.equal(
      expected
    );
  });

  afterEach(() => {
    if (generate.messageKey.restore) {
      generate.messageKey.restore();
    }
  });
});
