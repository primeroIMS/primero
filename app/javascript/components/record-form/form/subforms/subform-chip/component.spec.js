import { mountedComponent, screen } from "../../../../../test-utils";

import SubformChip from "./component";

describe("<RecordForm>/form/subforms/<SubformChip>", () => {
  const props = { label: "chip 1" };

  it("should render the subform chip", () => {
    mountedComponent(<SubformChip {...props} />);
    expect(screen.getAllByTestId("chip")).toHaveLength(1);
    expect(screen.getByText(/chip 1/iy)).toBeInTheDocument(1);
  });
});
