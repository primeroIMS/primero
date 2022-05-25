import { setupMountedComponent } from "../../../../test";
import { FormSectionField } from "../../../record-form";

import SummaryFields from "./component";

describe("<SummaryFields />", () => {
  let component;
  const values = {
    age: 10,
    case_id_display: "1234abcd",
    id: "1234567",
    name: "Test user",
    owned_by: "aa",
    owned_by_agency_id: "aa",
    sex: "aa",
    incident_date: "2022-05-02",
    incident_location: "IQG08Q02N02",
    incident_total_tally: {
      boys: 1,
      total: 2,
      unknown: 1
    },
    killing: []
  };
  const props = {
    recordType: "incident",
    recordID: "1234abcd",
    mode: { isNew: false, isEdit: false, isShow: true }
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(SummaryFields, props, {}, [], { values }));
  });

  it("should render <SummaryFields /> component", () => {
    expect(component.find(SummaryFields)).to.have.lengthOf(1);
  });

  it("should render 6 <FormSectionField /> component", () => {
    expect(component.find(FormSectionField)).to.have.lengthOf(6);
  });
});
