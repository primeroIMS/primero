import { mountedComponent, screen } from "../../../../../test-utils";

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

  it("should render a List component", () => {
    mountedComponent(<Navigation {...props} />);
    expect(screen.getByTestId("list")).toBeInTheDocument();
  });

  it("should render a ListItem", () => {
    mountedComponent(<Navigation {...props} />);
    expect(screen.getByTestId("list-item")).toBeInTheDocument();
  });

  it("should render a ListItemText", () => {
    mountedComponent(<Navigation {...props} />);
    expect(screen.getByText(/Some text/i)).toBeInTheDocument();
  });
});
