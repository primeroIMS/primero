import { setupMockFormComponent } from "../../../../../../../test";
import FormSection from "../../../../../../form/components/form-section";
import TraceActions from "../trace-actions";
import { FormSectionRecord, FieldRecord } from "../../../../../records";
import { TEXT_FIELD } from "../../../../../constants";

import TracesForm from "./component";

describe("<RecordForm>/form/subforms/<TracesForm>", () => {
  let component;
  const props = {
    handleBack: () => {},
    traceValues: {},
    formSection: FormSectionRecord({
      fields: [FieldRecord({ type: TEXT_FIELD, name: "test_field" })],
      setIn: () => {}
    }),
    handleConfirm: () => {},
    mode: { isEdit: false }
  };

  beforeEach(() => {
    ({ component } = setupMockFormComponent(TracesForm, { props }));
  });

  it("should render the TraceActions", () => {
    expect(component.find(TraceActions)).to.have.lengthOf(1);
  });

  it("should render a FormSection", () => {
    expect(component.find(FormSection)).to.have.lengthOf(1);
  });
});
