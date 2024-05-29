import { mountedComponent, screen } from "../../../../../test-utils";

import SubformDrawer from "./component";

describe("<RecordForm>/form/subforms/<SubformDrawer>", () => {
  const props = { open: true, children: "" };

  it("should render the subform drawer", () => {
    mountedComponent(<SubformDrawer {...props} />);
    expect(screen.getAllByTestId("drawer")).toHaveLength(1);
  });
});
