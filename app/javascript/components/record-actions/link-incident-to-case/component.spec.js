import { mountedComponent, screen } from "test-utils";

import LinkIncidentToCase from "./component";

describe("<LinkIncidentToCase />", () => {
  const props = {
    close: () => {},
    open: true, // Assuming the component should start in an open state
    currentPage: 1, // Example value
    selectedRecords: {}, // Example value
    clearSelectedRecords: () => {},
    recordType: "cases" // Example value
  };

  beforeEach(() => {
    mountedComponent(<LinkIncidentToCase {...props} />);
  });

  it("renders  Action Dialog", () => {
    expect(screen.getByText("incident.link_incident_to_case")).toBeInTheDocument();
  });

  it("render Form", () => {
    expect(screen.getByTestId("search-form-for-link-to-case")).toBeInTheDocument();
  });

  it("render Table", () => {
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("render Table and havig data", () => {
    expect(screen.getByText("potential_match.case_id")).toBeInTheDocument();
  });
});
