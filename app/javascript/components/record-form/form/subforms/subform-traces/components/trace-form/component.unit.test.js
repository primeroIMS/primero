import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../../../test";
import FormSection from "../../../../../../form/components/form-section";
import TraceActions from "../trace-actions";

import TracesForm from "./component";

describe("<RecordForm>/form/subforms/<TracesForm>", () => {
  let component;
  const props = {
    handleBack: () => {},
    traceValues: {},
    formSection: { fields: [] },
    handleConfirm: () => {}
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(TracesForm, props, fromJS([])));
  });

  it("should render the TraceActions", () => {
    expect(component.find(TraceActions)).to.have.lengthOf(1);
  });

  it("should render a FormSection", () => {
    expect(component.find(FormSection)).to.have.lengthOf(1);
  });
});
