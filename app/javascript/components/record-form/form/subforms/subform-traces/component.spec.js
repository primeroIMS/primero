import { mountedComponent, screen } from "../../../../../test-utils";
import { FormSectionRecord } from "../../../../form";

import SubformTraces from "./component";

describe("<RecordForm>/form/subforms/<SubformTraces>", () => {
  const props = {
    openDrawer: true,
    formSection: FormSectionRecord({ fields: [] }),
    handleClose: () => {},
    formik: { values: {} },
    field: { subform_section_configuration: { display_conditions: [] } },
    mode: { isEdit: false }
  };

  it("should render the subform traces", () => {
    mountedComponent(<SubformTraces {...props} />);
    expect(screen.getByText("tracing_request.back_to_traces")).toBeInTheDocument(1);
  });
});
