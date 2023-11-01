import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { FieldRecord, FormSectionRecord } from "../../../record-form/records";

import ChildrenMultipleViolations from "./component";

describe("<ChildrenMultipleViolations />", () => {
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
    mountedComponent(<ChildrenMultipleViolations {...props} />, {}, {}, [], { values: individualVictims });
  });

  it("should render custom title", () => {
    expect(screen.getByText("incidents.summary_mrm.fields.children_multiple_violation.label")).toBeInTheDocument();
  });
});
