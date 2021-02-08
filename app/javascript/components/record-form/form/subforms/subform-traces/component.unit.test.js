import { setupMountedComponent } from "../../../../../test";
import { FormSectionRecord } from "../../../../form";

import SubformTraces from "./component";

describe("<RecordForm>/form/subforms/<SubformTraces>", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(SubformTraces, {
      openDrawer: true,
      formSection: FormSectionRecord({ fields: [] }),
      handleClose: () => {},
      formik: { values: {} },
      field: { subform_section_configuration: { display_conditions: [] } },
      mode: { isEdit: false }
    }));
  });

  it("should render the subform traces", () => {
    expect(component.find(SubformTraces)).to.have.lengthOf(1);
  });
});
