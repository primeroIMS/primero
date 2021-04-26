import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";

import { MatchedTracePanel } from "./components";
import MatchedTraces from "./component";

describe("<MatchedTraces />", () => {
  let component;
  const props = {
    data: fromJS([{ id: "1234567" }]),
    setSelectedForm: () => {},
    record: fromJS({
      age: 10,
      case_id_display: "1234abcd",
      id: "1234567",
      name: "Test user",
      owned_by: "aa",
      owned_by_agency_id: "aa",
      sex: "aa"
    })
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(MatchedTraces, props, {}));
  });

  it("should render 1 <MatchedTracePanel /> component", () => {
    expect(component.find(MatchedTracePanel)).to.have.lengthOf(1);
  });

  context("when is new record", () => {
    let newRecordComponent;

    beforeEach(() => {
      ({ component: newRecordComponent } = setupMountedComponent(MatchedTraces, { ...props, record: {} }, {}));
    });

    it("should not render <MatchedTracePanel /> component", () => {
      expect(newRecordComponent.find(MatchedTracePanel)).to.have.lengthOf(0);
    });
  });
});
