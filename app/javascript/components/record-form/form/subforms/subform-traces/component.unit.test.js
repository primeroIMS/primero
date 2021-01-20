import { setupMountedComponent } from "../../../../../test";

import SubformTraces from "./component";

describe("<RecordForm>/form/subforms/<SubformTraces>", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(SubformTraces, {
      openDrawer: true,
      formSection: { fields: [] },
      handleClose: () => {},
      formik: { values: {} },
      field: { subform_section_configuration: { display_conditions: [] } }
    }));
  });

  it("should render the subform traces", () => {
    expect(component.find(SubformTraces)).to.have.lengthOf(1);
  });
});
