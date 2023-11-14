// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import SubformField from "../../../record-form/form/subforms";
import { FieldRecord, FormSectionRecord } from "../../../record-form/records";

import ChildrenMultipleViolations from "./component";

describe("<ChildrenMultipleViolations />", () => {
  let component;
  const individualVictims = [
    {
      unique_id: "1234abcd",
      individual_multiple_violations: true,
      age: 5,
      sex: "female"
    },
    {
      unique_id: "5678efga",
      age: 4,
      sex: "male"
    }
  ];
  const props = {
    formSections: fromJS([
      FormSectionRecord({
        fields: [
          FieldRecord({
            name: "individual_victims",
            subform_section_id: FormSectionRecord({})
          })
        ],
        description_en: "Individual victim(s)",
        unique_id: "individual_victims"
      })
    ]),
    recordType: "incident",
    values: {
      age: 10,
      case_id_display: "1234abcd",
      id: "1234567",
      name: "Test user",
      owned_by: "aa",
      owned_by_agency_id: "aa",
      sex: "aa",
      individual_victims: individualVictims
    }
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(ChildrenMultipleViolations, props, {}, [], { values: individualVictims }));
  });

  it("should render <ChildrenMultipleViolations /> component", () => {
    expect(component.find(ChildrenMultipleViolations)).to.have.lengthOf(1);
  });

  it("should render 1 <SubformField /> component", () => {
    expect(component.find(SubformField)).to.have.lengthOf(1);
  });

  it("should render custom title", () => {
    expect(component.find(SubformField).find("h3").text().trim()).to.equal(
      "incidents.summary_mrm.fields.children_multiple_violation.label"
    );
  });
});
