import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../../../test-utils";

import TraceMatches from "./component";

describe("<RecordForm>/form/subforms/<TraceMatches>", () => {
  const props = {
    traceValues: {
      unique_id: "12345"
    },
    tracingRequestValues: {
      short_id: "12",
      relation_name: "Tracing Request Name",
      inquiry_date: "2020-01-01"
    },
    recordType: "recordType1"
  };

  it("should render a list with the tracing request information", () => {
    mountedComponent(<TraceMatches {...props} />, fromJS([]));
    expect(screen.getByText(/tracing_requests.inquirer/i)).toBeInTheDocument();
    expect(screen.getByText(/tracing_requests.id:/i)).toBeInTheDocument();
    expect(screen.getByText(/tracing_requests.name:/i)).toBeInTheDocument();
    expect(screen.getByText(/tracing_requests.date_of_inquiry:/i)).toBeInTheDocument();
  });

  it("should render an IndexTable", () => {
    mountedComponent(<TraceMatches {...props} />, fromJS([]));
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});
