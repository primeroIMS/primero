import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../test";
import { PageHeading } from "../../page";

import Admin from "./container";

describe("<Admin />", () => {
  let component;
  const initialState = fromJS({});

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      Admin,
      {
        routes: []
      },
      initialState
    ));
  });

  it("renders the admin container", () => {
    expect(component.find(Admin)).to.have.lengthOf(1);
    expect(component.find(PageHeading).text()).to.equal("settings.title");
  });
});
