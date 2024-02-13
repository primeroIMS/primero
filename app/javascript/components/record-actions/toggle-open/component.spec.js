import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../test-utils";
import { RECORD_PATH } from "../../../config";

import ToggleOpen from "./component";

describe("<ToggleOpen />", () => {

  const record = fromJS({
    id: "03cdfdfe-a8fc-4147-b703-df976d200977",
    case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
    case_id_display: "9b4c525",
    name_first: "Test",
    name_last: "Case",
    name: "Test Case"
  });

  const props = {
    close: () => {},
    openReopenDialog: true,
    recordType: RECORD_PATH.cases,
    open: true,
    record
  };

  it("renders ToggleOpen", () => {
    mountedComponent(<ToggleOpen {...props} />)
    expect(screen.getByText(/cases.reopen_dialog_title/i)).toBeInTheDocument();
  });

  it("renders ActionDialog", () => {
    mountedComponent(<ToggleOpen {...props} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it("renders component with valid props", () => {
    mountedComponent(<ToggleOpen {...props} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
