import { Formik, Form } from "formik";
import { fromJS, Map, OrderedMap } from "immutable";

import ActionDialog from "../../action-dialog";
import { setupMountedComponent } from "../../../test";
import { FieldRecord, FormSectionRecord } from "../../record-form/records";
import { RECORD_PATH } from "../../../config";
import Fields from "../add-incident/fields";

import AddService from "./component";

describe("<AddService />", () => {
  let component;
  const initialState = Map({
    records: fromJS({
      cases: {
        data: [
          {
            sex: "male",
            created_at: "2020-01-07T14:27:04.136Z",
            name: "G P",
            case_id_display: "96f613f",
            owned_by: "primero_cp",
            status: "open",
            registration_date: "2020-01-07",
            id: "d9df44fb-95d0-4407-91fd-ed18c19be1ad"
          }
        ]
      }
    }),
    forms: Map({
      formSections: OrderedMap({
        1: FormSectionRecord({
          id: 1,
          unique_id: "services_section",
          name: { en: "Nested Services" },
          visible: false,
          is_first_tab: false,
          order: 30,
          order_form_group: 110,
          parent_form: "case",
          editable: true,
          module_ids: [],
          form_group_id: "",
          form_group_name: { en: "Nested Services" },
          fields: [2],
          is_nested: true,
          subform_prevent_item_removal: false,
          collapsed_field_names: ["service_type", "service_appointment_date"]
        }),
        2: FormSectionRecord({
          id: 2,
          unique_id: "services",
          name: { en: "Services" },
          visible: true,
          is_first_tab: false,
          order: 30,
          order_form_group: 110,
          parent_form: "case",
          editable: true,
          module_ids: ["primeromodule-cp"],
          form_group_id: "services_follow_up",
          form_group_name: { en: "Services / Follow Up" },
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
          display_name: { en: "Services" },
          multi_select: false,
          option_strings_source: null,
          option_strings_text: {},
          guiding_questions: "",
          required: false,
          date_validation: "default_date_validation",
          hide_on_view_page: false,
          date_include_time: false,
          selected_value: "",
          subform_sort_by: "service_appointment_date",
          show_on_minify_form: false
        }),
        2: FieldRecord({
          name: "service_provider",
          type: "text_field",
          editable: true,
          disabled: false,
          visible: true,
          display_name: { en: "Service Provider" },
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
    })
  });
  const props = {
    openServiceDialog: true,
    close: () => {},
    recordType: RECORD_PATH.cases,
    selectedRowsIndex: [0]
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(AddService, props, initialState));
  });

  it("renders Formik", () => {
    expect(component.find(Formik)).to.have.lengthOf(1);
  });

  it("renders ActionDialog", () => {
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("renders Form", () => {
    expect(component.find(Form)).to.have.lengthOf(1);
  });

  it("renders Fields", () => {
    expect(component.find(Fields)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const addService = { ...component.find(AddService).props() };

    ["openServiceDialog", "close", "recordType", "selectedRowsIndex"].forEach(
      property => {
        expect(addService).to.have.property(property);
        delete addService[property];
      }
    );
    expect(addService).to.be.empty;
  });
});
