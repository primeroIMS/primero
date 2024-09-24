import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import { FlagRecord } from "../../records";

import ListFlags from "./component";

describe("<ListFlags />", () => {
  const props = {
    recordType: "cases",
    record: "230590"
  };

  const initialState = fromJS({
    records: {
      flags: {
        data: [
          FlagRecord({
            id: 7,
            record_id: "230590",
            record_type: "cases",
            date: "2019-08-01",
            message: "This is a flag 1",
            flagged_by: "primero",
            removed: true
          })
        ]
      }
    }
  });

  it("renders Form", () => {
    mountedComponent(<ListFlags {...props} />, initialState);
    expect(screen.getByText("This is a flag 1")).toBeInTheDocument();
  });

  it("should render the FlagForm", () => {
    mountedComponent(<ListFlags {...props} />, initialState);
    expect(screen.getByRole("listitem")).toBeInTheDocument();
  });

  it("should render the FlagForm", () => {
    mountedComponent(<ListFlags {...props} />, initialState);
    expect(screen.getByText("flags.resolved", { selector: "h3" })).toBeInTheDocument();
  });
});
