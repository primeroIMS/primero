import { fromJS } from "immutable";

import TraceComparisonForm from "../../../record-form/form/subforms/subform-traces/components/trace-comparison-form";
import { setupMountedComponent } from "../../../../test";

import MatchesForm from "./component";

describe("<MatchesForm />", () => {
  let component;
  const props = {
    selectedForm: "test",
    recordType: "test-record-type",
    potentialMatch: fromJS({}),
    handleBack: () => {}
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(MatchesForm, props, {}));
  });

  it("should render 1 <TraceComparisonForm /> components", () => {
    expect(component.find(TraceComparisonForm)).to.have.lengthOf(1);
  });
});
