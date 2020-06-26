import { Tab, Tabs, Box } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";

import DialogTabs from "./component";

describe("<DialogTabs />", () => {
  let component;

  const props = {
    children: [{ props: { hidetab: true } }],
    isBulkFlags: false,
    tab: 0,
    setTab: () => {}
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(DialogTabs, props));
  });

  it("should render the DialogTabs", () => {
    expect(component.find(DialogTabs)).to.have.lengthOf(1);
  });

  it("should render the Box", () => {
    expect(component.find(Box)).to.have.lengthOf(2);
  });

  it("should render the Tabs", () => {
    expect(component.find(Tabs)).to.have.lengthOf(1);
  });

  it("should render two Tab", () => {
    expect(component.find(Tab)).to.have.lengthOf(2);
  });

  it("renders component with valid props", () => {
    const dialogTabsProps = { ...component.find(DialogTabs).props() };

    ["children", "isBulkFlags", "tab", "setTab"].forEach(property => {
      expect(dialogTabsProps).to.have.property(property);
      delete dialogTabsProps[property];
    });
    expect(dialogTabsProps).to.be.empty;
  });
});
