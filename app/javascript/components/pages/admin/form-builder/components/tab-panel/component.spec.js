import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import TabPanel from "./component";

describe("<TabPanel />", () => {
  const props = {
    tab: 1,
    index: 1
  };
  const initialState = fromJS({});

  beforeEach(() => {
    mountedComponent(<TabPanel {...props} />, initialState);
  });

  it("renders the TabPanel", () => {
    expect(screen.getByTestId("tab-panel")).toBeInTheDocument();
  });
});
