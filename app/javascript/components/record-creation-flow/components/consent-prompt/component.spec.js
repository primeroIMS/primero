import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import { RECORD_PATH, MODULES } from "../../../../config";
import { mapEntriesToRecord } from "../../../../libs";
import { FormSectionRecord, FieldRecord } from "../../../record-form/records";

import ConsentPrompt from "./component";

describe("<ConsentPrompt />", () => {
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
    mountedComponent(<ConsentPrompt {...props} />, initialState);
  });

  it("should render a form component", () => {
    expect(document.querySelector("#consent-prompt-form")).toBeInTheDocument();
  });

  it("should render a <ActionButton /> component", () => {
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});
