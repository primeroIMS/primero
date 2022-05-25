import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { FormSectionField } from "../../../record-form";

import SummaryFields from "./component";

describe("<SummaryFields />", () => {
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
    recordType: "incident",
    record: fromJS({
      age: 10,
      case_id_display: "1234abcd",
      id: "1234567",
      name: "Test user",
      owned_by: "aa",
      owned_by_agency_id: "aa",
      sex: "aa",
      individual_victims: individualVictims
    }),
    mode: { isNew: false, isEdit: false, isShow: true }
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(SummaryFields, props, {}, [], { values: individualVictims }));
  });

  it("should render <SummaryFields /> component", () => {
    expect(component.find(SummaryFields)).to.have.lengthOf(1);
  });

  it("should render 6 <FormSectionField /> component", () => {
    expect(component.find(FormSectionField)).to.have.lengthOf(6);
  });
});
