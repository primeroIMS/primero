import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import TransferRequest from "./component";

describe("<TransferRequest />", () => {
  const currentRecord = fromJS({
    id: "03cdfdfe-a8fc-4147-b703-df976d200977",
    case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
    case_id_display: "9b4c525",
    name_first: "Name",
    name_last: "Last",
    name: "Name Last",
    owned_by: "primero"
  });

  const props = {
    caseId: "1234",
    currentRecord,
    open: true,
    setOpen: () => {}
  };

  it("should render ActionDialog", () => {
    mountedComponent(<TransferRequest {...props} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
