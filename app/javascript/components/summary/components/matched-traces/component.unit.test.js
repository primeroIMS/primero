import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";

import { MatchedTracePanel } from "./components";
import MatchedTraces from "./component";

describe("<MatchedTraces />", () => {
  let component;
  const props = { data: fromJS([{ id: "1234567" }]), record: fromJS({}) };

  beforeEach(() => {
    ({ component } = setupMountedComponent(MatchedTraces, props, {}));
  });

  it("should render 1 <MatchedTracePanel /> component", () => {
    expect(component.find(MatchedTracePanel)).to.have.lengthOf(1);
  });
});
