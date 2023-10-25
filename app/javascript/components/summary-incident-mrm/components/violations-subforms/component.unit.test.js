// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import SubformField from "../../../record-form/form/subforms";
import { FieldRecord, FormSectionRecord } from "../../../record-form/records";

import ViolationsSubforms from "./component";

describe("<ViolationsSubforms />", () => {
  let component;
  const values = {
    age: 10,
    case_id_display: "1234abcd",
    id: "1234567",
    name: "Test user",
    owned_by: "aa",
    owned_by_agency_id: "aa",
    sex: "aa",
    killing: [
      {
        unique_id: 1,
        sample_key: "sample_value"
      }
    ]
  };

  const props = {
    formSections: fromJS([
      FormSectionRecord({
        fields: [
          FieldRecord({
            name: "killing",
            subform_section_id: FormSectionRecord({}),
            display_name: { en: "Killing of Children" }
          })
        ],
        description_en: "Killing",
        unique_id: "killing_violation_wrapper",
        display_name: { en: "Killing of Children" }
      })
    ]),
    recordType: "incident",
    values
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(ViolationsSubforms, props, {}, [], { values }));
  });

  it("should render <ViolationsSubforms /> component", () => {
    expect(component.find(ViolationsSubforms)).to.have.lengthOf(1);
  });

  it("should render 1 <SubformField /> component", () => {
    expect(component.find(SubformField)).to.have.lengthOf(1);
  });

  it("should render custom title", () => {
    expect(component.find(SubformField).find("h3").text().trim()).to.equal("Killing of Children");
  });
});
