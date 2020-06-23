import { Tab, Tabs } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";

import FormSectionTabs from "./component";

describe("<FormSectionTabs />", () => {
  let component;
  const props = {
    tabs: [
      { name: "tab 1", disabled: true, fields: [] },
      { name: "tab2", disabled: false, fields: [] }
    ]
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(FormSectionTabs, props, {}));
  });

  it("should render the FormSectionTabs component", () => {
    expect(component.find(FormSectionTabs)).to.have.lengthOf(1);
    expect(component.find(Tabs)).to.have.lengthOf(1);
    expect(component.find(Tab)).to.have.lengthOf(2);
  });
});
