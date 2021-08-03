import { fromJS } from "immutable";
import { TextField } from "@material-ui/core";

import { ACTIONS } from "../../../libs/permissions";
import { mapEntriesToRecord } from "../../../libs";
import { setupMountedComponent } from "../../../test";
import * as R from "../../record-form/records";
import { RECORD_TYPES } from "../../../config";

import ViewModal from "./component";

describe("<ViewModal />", () => {
  const formSections = {
    1: {
      id: 1,
      unique_id: "basic_identity",
      fields: [1, 2, 3, 4, 5, 6, 7],
      parent_form: RECORD_TYPES.cases,
      module_ids: ["record_module"],
      visible: true
    },
    2: {
      id: 2,
      unique_id: "nested_identity",
      fields: [8, 9],
      is_nested: true,
      parent_form: RECORD_TYPES.cases,
      module_ids: ["record_module"],
      visible: true
    }
  };

  const fields = {
    1: {
      name: "name_first",
      type: "text_field",
      display_name: { en: "First Name" },
      show_on_minify_form: true
    },
    2: {
      name: "name_last",
      type: "text_field",
      display_name: { en: "Last Name" },
      show_on_minify_form: true
    },
    3: {
      name: "name",
      type: "text_field",
      display_name: { en: "Full Name" },
      show_on_minify_form: true
    },
    4: {
      name: "sex",
      type: "text_field",
      display_name: { en: "Sex" }
    },
    5: {
      name: "estimated",
      type: "text_field",
      display_name: { en: "Estimated Age" }
    },
    6: {
      name: "age",
      type: "text_field",
      display_name: { en: "Age" }
    },
    7: {
      name: "date_of_birth",
      type: "date_field",
      display_name: { en: "Date of Birth" }
    },
    8: {
      name: "address",
      type: "text_field",
      show_on_minify_form: true
    },
    9: {
      name: "telephone",
      type: "text_field",
      show_on_minify_form: true
    }
  };

  const currentRecord = fromJS({
    id: "03cdfdfe-a8fc-4147-b703-df976d200977",
    case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
    case_id_display: "9b4c525",
    name_first: "Name",
    name_last: "Last",
    name: "Name Last",
    owned_by: "primero",
    module_id: "record_module"
  });

  const props = {
    close: () => {},
    openViewModal: true,
    currentRecord,
    recordType: "cases"
  };

  it("should render the mini form fields", () => {
    const initialState = fromJS({
      user: { permissions: { cases: [] } },
      forms: {
        formSections: mapEntriesToRecord(formSections, R.FormSectionRecord),
        fields: mapEntriesToRecord(fields, R.FieldRecord)
      }
    });

    const { component } = setupMountedComponent(ViewModal, props, initialState);

    const fieldNames = component
      .find(ViewModal)
      .find(TextField)
      .map(field => field.props().name);

    expect(fieldNames).to.include.members(["name_first", "name_last"]);
  });

  it("should not render nested fields even if they are show_on_minify_form", () => {
    const initialState = fromJS({
      user: { permissions: { cases: [] } },
      forms: {
        formSections: mapEntriesToRecord(formSections, R.FormSectionRecord),
        fields: mapEntriesToRecord(fields, R.FieldRecord)
      }
    });

    const { component } = setupMountedComponent(ViewModal, props, initialState);

    const fieldNames = component
      .find(ViewModal)
      .find(TextField)
      .map(field => field.props().name);

    expect(fieldNames).to.not.have.members(["address", "telephone"]);
  });

  it("should not render the Request Transfer button if the user does not have permission", () => {
    const initialState = fromJS({
      user: { permissions: { cases: [] } },
      forms: {
        formSections: mapEntriesToRecord(formSections, R.FormSectionRecord),
        fields: mapEntriesToRecord(fields, R.FieldRecord)
      }
    });

    const { component } = setupMountedComponent(ViewModal, props, initialState);
    const actionButtons = component
      .find(ViewModal)
      .find("button")
      .map(button => button.text())
      .filter(text => text === "buttons.request_transfer");

    expect(actionButtons).to.be.empty;
  });

  it("should render the Request Transfer button if the user has permission", () => {
    const initialState = fromJS({
      user: { permissions: { cases: [ACTIONS.REQUEST_TRANSFER] } },
      forms: {
        formSections: mapEntriesToRecord(formSections, R.FormSectionRecord),
        fields: mapEntriesToRecord(fields, R.FieldRecord)
      }
    });

    const { component } = setupMountedComponent(ViewModal, props, initialState);
    const actionButtons = component
      .find(ViewModal)
      .find("button")
      .map(button => button.text())
      .filter(text => text === "buttons.request_transfer");

    expect(actionButtons).to.have.lengthOf(1);
  });
});
