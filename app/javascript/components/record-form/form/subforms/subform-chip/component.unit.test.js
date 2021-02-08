import { setupMountedComponent } from "../../../../../test";

import SubformChip from "./component";

describe("<RecordForm>/form/subforms/<SubformChip>", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(SubformChip, { label: "chip 1" }));
  });

  it("should render the subform chip", () => {
    expect(component.find(SubformChip)).to.have.lengthOf(1);
    expect(component.find(SubformChip).find("span").text()).to.equal("chip 1");
  });
});
