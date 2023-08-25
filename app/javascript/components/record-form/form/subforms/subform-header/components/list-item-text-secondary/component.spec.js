import { mountedComponent, screen } from "../../../../../../../test-utils";
import ListItemTextSecondary from "./component";

describe("<RecordForm>/form/subforms/<SubformHeader/>/components/<ListItemTextSecondary />", () => {
  it("should render component", () => {
    const props = {
      associatedViolations: {
        killing: [1],
        maiming: [2, 3],
        denials: [5, 6, 7]
      },
      violationsIDs: [1, 3],
      renderSecondaryText: true
    };

    mountedComponent(<ListItemTextSecondary {...props} />);

    expect(screen.getByTestId("list-item-text-secondary-violations")).toBeInTheDocument();
    expect(screen.getByText(/incident.violation.associated_violations/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("volation-keys")).toHaveLength(2);
  });
});
