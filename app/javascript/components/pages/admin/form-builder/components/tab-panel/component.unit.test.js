import { fromJS } from "immutable";
import { Paper } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../../test";

import TabPanel from "./component";

describe("<TabPanel />", () => {
  let component;
  const initialState = fromJS({});

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      TabPanel,
      {
        tab: 1,
        index: 1
      },
      initialState
    ));
  });

  it("renders the TabPanel", () => {
    expect(component.find(Paper)).to.have.lengthOf(1);
  });
});
