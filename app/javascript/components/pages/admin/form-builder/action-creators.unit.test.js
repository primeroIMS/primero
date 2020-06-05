import { stub } from "../../../../test";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<FormsBuilder /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    [
      "clearSelectedForm",
      "createSelectedField",
      "fetchForm",
      "reorderFields",
      "saveForm",
      "setNewField",
      "setSelectedField",
      "updateSelectedField"
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

  it("should check the 'setNewField' action creator to return the correct object", () => {
    const expected = {
      type: actions.SET_NEW_FIELD,
      payload: { name: "new_field", type: "text_box" }
    };

    expect(actionCreators.setNewField("new_field", "text_box")).to.deep.equal(
      expected
    );
  });

  it("should check the 'setNewField' action creator to return the correct object", () => {
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

  afterEach(() => {
    if (generate.messageKey.restore) {
      generate.messageKey.restore();
    }
  });
});
