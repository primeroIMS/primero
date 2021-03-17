import { fromJS } from "immutable";

import { stub } from "../../../../test";
import { generate, ENQUEUE_SNACKBAR } from "../../../notifier";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<FormsBuilder /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    [
      "clearSelectedField",
      "clearSelectedForm",
      "clearSelectedSubform",
      "clearSelectedSubformField",
      "clearSubforms",
      "createSelectedField",
      "fetchForm",
      "mergeOnSelectedSubform",
      "reorderFields",
      "saveForm",
      "saveSubforms",
      "selectExistingFields",
      "setNewField",
      "setNewSubform",
      "setSelectedField",
      "setSelectedSubform",
      "setSelectedSubformField",
      "setTemporarySubform",
      "updateFieldTranslations",
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

  it("should check the 'clearSelectedSubform' action creator to return the correct object", () => {
    const expected = {
      type: actions.CLEAR_SELECTED_SUBFORM
    };

    expect(actionCreators.clearSelectedSubform()).to.deep.equal(expected);
  });

  it("should check the 'clearSelectedField' action creator to return the correct object", () => {
    const expected = {
      type: actions.CLEAR_SELECTED_FIELD
    };

    expect(actionCreators.clearSelectedField()).to.deep.equal(expected);
  });

  it("should check the 'clearSelectedSubformField' action creator to return the correct object", () => {
    const expected = {
      type: actions.CLEAR_SELECTED_SUBFORM_FIELD
    };

    expect(actionCreators.clearSelectedSubformField()).to.deep.equal(expected);
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
        successCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.message,
              options: {
                key: 4,
                variant: "success"
              }
            },
            redirect: "/admin/forms",
            redirectToEdit: true
          },
          {
            action: "admin/forms/CLEAR_SUBFORMS"
          }
        ]
      }
    };

    expect(actionCreators.saveForm(args)).to.deep.equal(expected);
    generate.messageKey.restore();
  });

  it("should check the 'setNewField' action creator to return the correct object", () => {
    const data = {
      name: "new_field",
      type: "text_box",
      visible: true,
      mobile_visible: true,
      hide_on_view_page: false
    };

    const expected = {
      type: actions.SET_NEW_FIELD,
      payload: data
    };

    expect(actionCreators.setNewField(data)).to.deep.equal(expected);
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
      payload: 1
    };

    expect(actionCreators.setSelectedSubform(1)).to.deep.equal(expected);
  });

  it("should check the 'SET_SELECTED_SUBFORM_FIELD' action creator to return the correct object", () => {
    const expected = {
      type: actions.SET_SELECTED_SUBFORM_FIELD,
      payload: { name: "field_1" }
    };

    expect(actionCreators.setSelectedSubformField("field_1")).to.deep.equal(expected);
  });

  it("should check the 'updateSelectedField' action creator to return the correct object", () => {
    const field = { name: "field_1", display_text: { en: "Field 1" } };
    const expected = {
      type: actions.UPDATE_SELECTED_FIELD,
      payload: { data: field, subformId: null }
    };

    expect(actionCreators.updateSelectedField(field)).to.deep.equal(expected);
  });

  it("should check the 'updateSelectedSubform' action creator to return the correct object", () => {
    const subform = { id: 1, name: { en: "Subform 1" } };
    const expected = {
      type: actions.UPDATE_SELECTED_SUBFORM,
      payload: { data: subform }
    };

    expect(actionCreators.updateSelectedSubform(subform)).to.deep.equal(expected);
  });

  it("should check the 'createSelectedField' action creator to return the correct object", () => {
    const data = {
      this_is_text_area_3: {
        display_name: {
          en: "this is text area 3"
        },
        help_text: {
          en: ""
        },
        guiding_questions: {
          en: ""
        },
        required: false,
        visible: true,
        mobile_visible: false,
        hide_on_view_page: false,
        show_on_minify_form: false,
        type: "textarea",
        name: "this_is_text_area_3"
      }
    };
    const expected = {
      type: actions.CREATE_SELECTED_FIELD,
      payload: {
        data
      }
    };

    expect(actionCreators.createSelectedField(data)).to.deep.equal(expected);
  });

  it("should check the 'reorderFields' action creator to return the correct object", () => {
    const expected = {
      type: actions.REORDER_FIELDS,
      payload: { name: "field_1", order: 0, isSubform: true }
    };

    expect(actionCreators.reorderFields("field_1", 0, true)).to.deep.equal(expected);
  });

  it("should check the 'updateFieldTranslations' action creator to return the correct object", () => {
    const expected = {
      type: actions.UPDATE_FIELD_TRANSLATIONS,
      payload: { field1: { display_name: { en: "Field 1" } } }
    };

    expect(actionCreators.updateFieldTranslations({ field1: { display_name: { en: "Field 1" } } })).to.deep.equal(
      expected
    );
  });

  afterEach(() => {
    if (generate.messageKey.restore) {
      generate.messageKey.restore();
    }
  });

  it("should check the 'mergeOnSelectedSubform' action creator to return the correct object", () => {
    const payload = {
      display_name: { en: "Field 1" }
    };

    const expected = {
      type: actions.MERGE_SUBFORM_DATA,
      payload
    };

    expect(actionCreators.mergeOnSelectedSubform(payload)).to.deep.equal(expected);
  });

  it("should check the 'selectExistingFields' action creator to return the correct object", () => {
    const payload = {
      addedFields: [],
      removedFields: []
    };

    const expected = {
      type: actions.SELECT_EXISTING_FIELDS,
      payload
    };

    expect(actionCreators.selectExistingFields(payload)).to.deep.equal(expected);
  });

  it("should check the 'saveSubforms' action creator to return the correct object", () => {
    stub(generate, "messageKey").returns(4);
    const fields = [
      {
        id: 146,
        display_name: {
          en: "Test Field"
        },
        type: "select_box",
        option_strings_text: [
          {
            id: "abuse_exploitation",
            display_text: {
              en: "Abuse & Exploitation"
            }
          },
          {
            id: "death_of_caregiver",
            display_text: {
              en: "Death of Caregiver"
            }
          }
        ]
      }
    ];
    const body = fromJS({
      data: {
        fields
      }
    });
    const subforms = fromJS([
      {
        id: 10,
        unique_id: "care_arrangements_section",
        fields,
        editable: true
      }
    ]);

    const parentFormParams = {
      id: 1,
      saveMethod: "update",
      body,
      message: "updated"
    };

    const result = actionCreators.saveSubforms(subforms, parentFormParams);

    expect(Object.keys(result)).to.deep.equal(["type", "api", "finishedCallback"]);
  });
});
