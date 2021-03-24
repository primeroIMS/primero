import { List, ListItem, ListItemText } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../test";

import Navigation from "./component";

describe("<Navigation />", () => {
  const props = {
    css: {},
    handleToggleNav: () => {},
    menuList: [{ id: "test", text: "Some text", disabled: false }],
    mobileDisplay: false,
    onClick: () => {},
    selectedItem: "test",
    toggleNav: false
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(Navigation, props));
  });

  it("should render a List component", () => {
    expect(component.find(List)).to.have.lengthOf(1);
  });

  it("should render a ListItem", () => {
    expect(component.find(ListItem)).to.have.lengthOf(1);
  });

  it("should render a ListItemText", () => {
    const listItemText = component.find(ListItemText);

    expect(listItemText).to.have.lengthOf(1);
    expect(listItemText.text()).to.be.equals("Some text");
  });
});
