import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";
import { FieldRecord, FormSectionRecord } from "../../../record-form/records";

import ViolationsSubforms from "./component";

describe("<ViolationsSubforms />", () => {
 
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
    mountedComponent(<ViolationsSubforms {...props} />,{},{},[],{ values });
  });

  it("should render custom title", () => {
    expect(screen.getByText("Killing of Children")).toBeInTheDocument();
  });
});
