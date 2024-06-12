import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import IncidentSummary from "./component";

describe("<IncidentSummary /> - Component", () => {
  const props = {
    incidentDate: "2020-Oct-01",
    css: {
      titleHeader: {}
    },
    incidentType: <></>
  };

  beforeEach(() => {
    mountedComponent(<IncidentSummary {...props} />, fromJS({}));
  });

  it("render IncidentSummary component", () => {
    expect(screen.getByText("2020-Oct-01")).toBeInTheDocument();
  });
});
