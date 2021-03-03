import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";
import { RECORD_PATH, MODULES } from "../../config";
import ActionButton from "../action-button";
import FormSection from "../form/components/form-section";
import { mapEntriesToRecord } from "../../libs";
import { FormSectionRecord, FieldRecord } from "../record-form/records";

import RecordCreationFlow from "./component";

describe("<RecordCreationFlow />", () => {
  let component;
  const formSections = {
    1: {
      id: 1,
      unique_id: "consent",
      parent_form: "case",
      module_ids: fromJS(["primeromodule-cp"]),
      order: 1,
      form_group_id: "group_1",
      order_form_group: 2,
      fields: fromJS([1])
    }
  };

  const fields = {
    1: {
      id: 1,
      name: "legitimate_basis",
      display_name: { en: "Field 1 " },
      form_section_id: 1
    }
  };

  const props = {
    open: true,
    onClose: () => {},
    recordType: RECORD_PATH.cases,
    primeroModule: MODULES.CP
  };

  const initialState = fromJS({
    application: {
      modules: [
        {
          unique_id: MODULES.CP,
          options: {
            data_protection_case_create_field_names: ["legitimate_basis"]
          }
        }
      ]
    },
    forms: {
      formSections: mapEntriesToRecord(formSections, FormSectionRecord, true),
      fields: mapEntriesToRecord(fields, FieldRecord)
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(RecordCreationFlow, props, initialState));
  });

  it("should render a <FormSection /> component", () => {
    expect(component.find(FormSection)).to.have.lengthOf(1);
  });

  it("should render a form component", () => {
    expect(component.find("form")).to.have.lengthOf(1);
  });

  it("should render a <ActionButton /> component", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(3);
  });
});
