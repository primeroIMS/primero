import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { RECORD_PATH, MODULES } from "../../../../config";
import ActionButton from "../../../action-button";
import FormSection from "../../../form/components/form-section";
import { mapEntriesToRecord } from "../../../../libs";
import { FormSectionRecord, FieldRecord } from "../../../record-form/records";

import ConsentPrompt from "./component";

describe("<ConsentPrompt />", () => {
  let component;
  const formSections = {
    1: {
      id: 1,
      unique_id: "consent",
      parent_form: "case",
      module_ids: fromJS([MODULES.CP]),
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
    i18n: { t: value => value },
    recordType: RECORD_PATH.cases,
    searchValue: "",
    primeroModule: MODULES.CP,
    dataProtectionFields: ["legitimate_basis"],
    goToNewCase: () => {},
    openConsentPrompt: true
  };

  const initialState = fromJS({
    forms: {
      formSections: mapEntriesToRecord(formSections, FormSectionRecord, true),
      fields: mapEntriesToRecord(fields, FieldRecord)
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(ConsentPrompt, props, initialState));
  });

  it("should render a <FormSection /> component", () => {
    expect(component.find(FormSection)).to.have.lengthOf(1);
  });

  it("should render a form component", () => {
    expect(component.find("form")).to.have.lengthOf(1);
  });

  it("should render a <ActionButton /> component", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(1);
  });
});
