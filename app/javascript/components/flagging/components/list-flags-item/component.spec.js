import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";
import ListFlagsItemActions from "./component";
describe("<ListFlagsItemActions />", () => {
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
    user: {
      username: "primero"
    }
  });

  beforeEach(() => {
    mountedComponent(<ListFlagsItemActions {...props} />, initialState);
  });

  it("should render the ListFlagsItem", () => {
    expect(screen.getByText("flags.date")).toBeInTheDocument();
  });

  it("should render the DateFlag", () => {
    expect(screen.getByRole("dateflag")).toBeInTheDocument();
  });
});