import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";
import Unflag from "./component";
import { UNFLAG_DIALOG } from "./constants";
describe("<Unflag />", () => {
  const props = {
    flag: {
      id: 7,
      record_id: "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0",
      record_type: "cases",
      date: "2019-08-01",
      message: "This is a flag 1",
      flagged_by: "primero",
      removed: false
    }
  };

  const initialState = fromJS({
    ui: { dialogs: { dialog: UNFLAG_DIALOG, open: true } }
  });

  beforeEach(() => {
    mountedComponent(<Unflag {...props} />, initialState);
  });

  it("should render the Unflag", () => {
    expect(screen.getAllByText("flags.resolve_reason")).toBeTruthy();
  });

  it("renders ActionButton", () => {
    expect(screen.getByText("cancel")).toBeInTheDocument();
    expect(screen.getByText("flags.resolve_button")).toBeInTheDocument();
  });
});





