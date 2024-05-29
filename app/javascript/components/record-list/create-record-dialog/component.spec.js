import { mountedComponent, screen, fireEvent } from "test-utils";
import { fromJS } from "immutable";

import CreateRecordDialog from "./component";

describe("<CreateRecordDialog /> record-list/create-record-dialog", () => {
  const props = {
    open: true,
    setOpen: () => {},
    moduleUniqueId: "testmodule-1",
    recordType: "cases"
  };

  const state = fromJS({
    records: {
      cases: {
        data: [{ unique_id: "testcase-1" }]
      }
    }
  });

  it("renders a <CreateRecordDialog />", () => {
    mountedComponent(<CreateRecordDialog {...props} />, state);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("redirects to new case if create new case is clicked", () => {
    const { history } = mountedComponent(<CreateRecordDialog {...props} />, state);

    fireEvent.click(screen.getByText(/case.create_new_case/i).closest("button"));
    expect(history.location.pathname).toBe("/cases/testmodule-1/new");
  });
});
