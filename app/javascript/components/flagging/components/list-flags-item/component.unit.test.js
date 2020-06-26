import { setupMountedComponent } from "../../../../test";

import ListFlagsItem from "./component";

describe("<ListFlagsItem />", () => {
  let component;

  const props = {
    flag: null,
    handleDelete: () => {}
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(ListFlagsItem, props));
  });

  it("should render the ListFlagsItem", () => {
    expect(component.find(ListFlagsItem)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const listFlagsItemProps = { ...component.find(ListFlagsItem).props() };

    ["flag", "handleDelete"].forEach(property => {
      expect(listFlagsItemProps).to.have.property(property);
      delete listFlagsItemProps[property];
    });
    expect(listFlagsItemProps).to.be.empty;
  });
});
