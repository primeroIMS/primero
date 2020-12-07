import { fromJS } from "immutable";
import { MenuItem } from "@material-ui/core";

import { setupMountedComponent } from "../../test";
import Menu from "../menu";

import UserActions from "./component";

describe("<UserActions>", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(UserActions, { id: "1" }, fromJS({})));
  });

  it("should render the Menu", () => {
    expect(component.find(Menu)).to.have.lengthOf(1);
  });

  it("should render the MenuItem", () => {
    expect(component.find(MenuItem)).to.have.lengthOf(1);
  });
});
