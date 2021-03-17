import { fromJS } from "immutable";
import { Tab } from "@material-ui/core";
import { Router } from "react-router-dom";

import { ROUTES } from "../../../../config";
import { setupMountedComponent } from "../../../../test";
import { mapEntriesToRecord } from "../../../../libs";
import { FormSectionRecord } from "../../../form/records";
import { RECORD_TYPES } from "../../../../config/constants";
import { ACTIONS } from "../../../../libs/permissions";

import FormBuilderActionButtons from "./components/action-buttons";
import FormsBuilder from "./component";
import CustomFieldDialog from "./components/custom-field-dialog";

describe("<FormsBuilder />", () => {
  let component;

  const formSections = [
    {
      id: 1,
      unique_id: "form_section_1",
      parent_form: "case",
      module_ids: fromJS(["primeromodule-cp"]),
      order: 1,
      form_group_id: "group_1",
      order_form_group: 2,
      fields: fromJS([])
    },
    {
      id: 2,
      unique_id: "form_section_2",
      parent_form: "case",
      module_ids: fromJS(["primeromodule-cp"]),
      order: 2,
      form_group_id: "group_1",
      order_form_group: 2,
      fields: fromJS([])
    },
    {
      id: 5,
      unique_id: "form_section_5",
      parent_form: "case",
      module_ids: fromJS(["primeromodule-cp"]),
      order: 1,
      form_group_id: "group_2",
      order_form_group: 1,
      fields: fromJS([])
    },
    {
      id: 6,
      unique_id: "form_section_6",
      parent_form: "case",
      module_ids: fromJS(["primeromodule-cp"]),
      order: 1,
      is_nested: true,
      form_group_id: "group_2",
      order_form_group: 1,
      fields: fromJS([])
    }
  ];

  const user = {
    permissions: {
      metadata: [ACTIONS.MANAGE]
    }
  };

  const initialState = fromJS({
    application: {
      modules: [
        {
          unique_id: "primeromodule-cp",
          name: "CP",
          associated_record_types: [RECORD_TYPES.cases, RECORD_TYPES.tracing_requests, RECORD_TYPES.incidents]
        }
      ]
    },
    records: {
      admin: {
        forms: {
          formSections: mapEntriesToRecord(formSections, FormSectionRecord, true),
          selectedForm: FormSectionRecord(formSections[0])
        }
      }
    },
    user
  });

  describe("when is a new form", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(FormsBuilder, { mode: "new" }, initialState));
    });

    it("renders a enabled Settings Tab ", () => {
      const settingsTab = component.find(Tab).first();

      expect(settingsTab.text()).to.equal("forms.settings");
      expect(settingsTab.props().disabled).to.be.undefined;
    });

    it("renders the Fields and Translations Tabs disabled", () => {
      expect(component.find(Tab).at(1).props().disabled).to.be.true;
      expect(component.find(Tab).at(2).props().disabled).to.be.true;
    });

    it("renders the Action Buttons", () => {
      expect(component.find(FormBuilderActionButtons)).to.exist;
    });

    it("renders the CustomFieldDialog", () => {
      expect(component.find(CustomFieldDialog)).to.exist;
    });
  });

  describe("when in edit mode", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(FormsBuilder, { mode: "edit" }, initialState, ["/admin/forms/1/edit"]));
    });

    it("renders all tabs enabled ", () => {
      expect(component.find(Tab).at(0).props().disabled).to.be.undefined;
      expect(component.find(Tab).at(1).props().disabled).to.be.false;
      expect(component.find(Tab).at(2).props().disabled).to.be.false;
    });
  });

  describe("when the form is a subform", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        FormsBuilder,
        { mode: "edit" },
        fromJS({
          records: {
            admin: {
              forms: {
                formSections: mapEntriesToRecord(formSections, FormSectionRecord, true),
                selectedForm: FormSectionRecord(formSections[3])
              }
            }
          },
          user
        })
      ));
    });

    it("redirects to forms list since subforms are edited through the field dialog", () => {
      const { history } = component.find(Router).props();

      expect(history.action).to.equal("PUSH");
      expect(history.location.pathname).to.equal(ROUTES.forms);
    });
  });
});
