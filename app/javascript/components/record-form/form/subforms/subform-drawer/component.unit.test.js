import { setupMountedComponent } from "../../../../../test";

import SubformDrawer from "./component";

describe("<RecordForm>/form/subforms/<SubformDrawer>", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(SubformDrawer, { open: true, children: "" }));
  });

  it("should render the subform drawer", () => {
    expect(component.find(SubformDrawer)).to.have.lengthOf(1);
  });
});
