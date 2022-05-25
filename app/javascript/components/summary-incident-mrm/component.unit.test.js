import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";
import RecordFormTitle from "../record-form/form/record-form-title";
import { FieldRecord, FormSectionRecord } from "../record-form/records";

import ViolationsSubforms from "./components/violations-subforms";
import SummaryFields from "./components/summary-fields";
import ChildrenMultipleViolations from "./components/children-multiple-violations";
import SummaryIncidentMRM from "./component";

describe("<SummaryIncidentMRM />", () => {
  let component;
  const values = {
    age: 10,
    case_id_display: "1234abcd",
    id: "1234567",
    name: "Test user",
    owned_by: "aa",
    owned_by_agency_id: "aa",
    sex: "aa",
    killing: [],
    individual_victims: [
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
    ]
  };

  const props = {
    recordType: "incident",
    handleToggleNav: () => {},
    mobileDisplay: false,
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
      }),
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
    values,
    mode: { isNew: false, isEdit: false, isShow: true }
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(SummaryIncidentMRM, props, {}, [], { values }));
  });

  it("should render <SummaryIncidentMRM /> component", () => {
    expect(component.find(SummaryIncidentMRM)).to.have.lengthOf(1);
  });

  it("should render <SummaryFields /> component", () => {
    expect(component.find(SummaryFields)).to.have.lengthOf(1);
  });

  it("should render <RecordFormTitle /> component", () => {
    expect(component.find(RecordFormTitle)).to.have.lengthOf(1);
  });

  it("should render <ViolationsSubforms /> component", () => {
    expect(component.find(ViolationsSubforms)).to.have.lengthOf(1);
  });

  it("should render <ChildrenMultipleViolations /> component", () => {
    expect(component.find(ChildrenMultipleViolations)).to.have.lengthOf(1);
  });
});
