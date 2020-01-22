import { expect } from "chai";
import { OrderedMap, fromJS } from "immutable";
import { Menu, MenuItem } from "@material-ui/core";

import { setupMountedComponent } from "../../test";
import { ACTIONS } from "../../libs/permissions";
import { FieldRecord, FormSectionRecord } from "../record-form/records";

import Notes from "./notes";
import RecordActions from "./container";
import { ToggleEnable } from "./toggle-enable";
import { ToggleOpen } from "./toggle-open";
import RequestApproval from "./request-approval";
import { Transitions } from "./transitions";

describe("<RecordActions />", () => {
  const forms = {
    formSections: OrderedMap({
      1: FormSectionRecord({
        id: 1,
        unique_id: "incident_details_subform_section",
        name: { en: "Nested Incident Details Subform" },
        visible: false,
        is_first_tab: false,
        order: 20,
        order_form_group: 110,
        parent_form: "case",
        editable: true,
        module_ids: [],
        form_group_id: "",
        form_group_name: { en: "Nested Incident Details Subform" },
        fields: [2],
        is_nested: true,
        subform_prevent_item_removal: false,
        collapsed_field_names: ["cp_incident_date", "cp_incident_violence_type"]
      }),
      2: FormSectionRecord({
        id: 2,
        unique_id: "incident_details_container",
        name: { en: "Incident Details" },
        visible: true,
        is_first_tab: false,
        order: 0,
        order_form_group: 30,
        parent_form: "case",
        editable: true,
        module_ids: ["primeromodule-cp"],
        form_group_id: "identification_registration",
        form_group_name: { en: "Identification / Registration" },
        fields: [1],
        is_nested: false,
        subform_prevent_item_removal: false,
        collapsed_field_names: []
      })
    }),
    fields: OrderedMap({
      1: FieldRecord({
        name: "incident_details",
        type: "subform",
        editable: true,
        disabled: false,
        visible: true,
        subform_section_id: 1,
        help_text: { en: "" },
        display_name: { en: "" },
        multi_select: false,
        option_strings_source: null,
        option_strings_text: {},
        guiding_questions: "",
        required: false,
        date_validation: "default_date_validation",
        hide_on_view_page: false,
        date_include_time: false,
        selected_value: "",
        subform_sort_by: "summary_date",
        show_on_minify_form: false
      }),
      2: FieldRecord({
        name: "cp_incident_location_type_other",
        type: "text_field",
        editable: true,
        disabled: false,
        visible: true,
        subform_section_id: null,
        help_text: {},
        multi_select: false,
        option_strings_source: null,
        option_strings_text: {},
        guiding_questions: "",
        required: false,
        date_validation: "default_date_validation",
        hide_on_view_page: false,
        date_include_time: false,
        selected_value: "",
        subform_sort_by: "",
        show_on_minify_form: false
      })
    })
  };
  let component;
  const defaultState = fromJS({
    user: {
      permissions: {
        cases: [ACTIONS.MANAGE]
      }
    },
    forms
  });
  const props = {
    recordType: "cases",
    mode: { isShow: true },
    record: fromJS({ status: "open" })
  };

  describe("Component ToggleOpen", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
    });

    it("renders ToggleOpen", () => {
      expect(component.find(ToggleOpen)).to.have.length(1);
    });
  });

  describe("Component ToggleEnable", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
    });

    it("renders ToggleEnable", () => {
      expect(component.find(ToggleEnable)).to.have.length(1);
    });
  });

  describe("Component RequestApproval", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
    });

    it("renders RequestApproval", () => {
      expect(component.find(RequestApproval)).to.have.length(1);
    });
  });

  describe("Component Transitions", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
    });
    it("renders Transitions", () => {
      expect(component.find(Transitions)).to.have.length(1);
    });
  });

  describe("Component Notes", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
    });

    it("renders Notes", () => {
      expect(component.find(Notes)).to.have.length(1);
    });
  });

  describe("Component Menu", () => {
    describe("when user has access to all menus", () => {
      beforeEach(() => {
        ({ component } = setupMountedComponent(
          RecordActions,
          props,
          fromJS({
            records: {
              cases: {
                filters: {
                  id_search: true
                }
              }
            },
            user: {
              permissions: {
                cases: [ACTIONS.MANAGE]
              }
            },
            forms
          })
        ));
      });
      it("renders Menu", () => {
        expect(component.find(Menu)).to.have.length(1);
      });

      it("renders MenuItem", () => {
        expect(component.find(MenuItem)).to.have.length(9);
      });

      it("renders MenuItem with Refer Cases option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("buttons.referral forms.record_types.case")
        ).to.be.equal(true);
      });

      it("renders MenuItem with Add Incident option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("actions.incident_details_from_case")
        ).to.be.equal(true);
      });

      it("renders MenuItem with Add Services Provision option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("actions.services_section_from_case")
        ).to.be.equal(true);
      });
    });

    describe("when user has not access to all menus", () => {
      beforeEach(() => {
        ({ component } = setupMountedComponent(
          RecordActions,
          props,
          fromJS({
            user: {
              permissions: {
                cases: [ACTIONS.READ]
              }
            }
          })
        ));
      });

      it("renders Menu", () => {
        expect(component.find(Menu)).to.have.length(1);
      });

      it("renders MenuItem", () => {
        expect(component.find(MenuItem)).to.be.empty;
      });

      it("renders MenuItem without Refer Cases option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("buttons.referral orms.record_types.case")
        ).to.be.false;
      });

      it("renders MenuItem without Export custom option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("exports.custom_exports.label")
        ).to.be.false;
      });
    });
  });
});
