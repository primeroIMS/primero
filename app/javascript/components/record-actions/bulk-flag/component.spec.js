import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import BulkFlag from "./component";

describe("<BulkFlag />", () => {
  const props = {
    close: () => {},
    open: true,
    currentPage: 0,
    selectedRecords: { 0: [0] },
    clearSelectedRecords: () => {},
    recordType: "cases"
  };

  const initialState = fromJS({
    records: {
      cases: {
        data: [{ id: "abc123" }]
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<BulkFlag {...props} />, initialState);
  });

  it("renders the dialog with the correct title", () => {
    expect(screen.getByText("flags.bulk_flag_title")).toBeInTheDocument();
  });

  it("renders the selected count subheader", () => {
    expect(screen.getByText(/flags.bulk_selected/)).toBeInTheDocument();
  });

  it("renders the Flag Reason field", () => {
    expect(screen.getAllByText("flags.flag_reason").length).toBeGreaterThan(0);
  });

  it("renders the Flag Date field", () => {
    expect(screen.getAllByText("flags.flag_date").length).toBeGreaterThan(0);
  });
});
