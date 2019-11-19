import { expect } from "chai";
import { Button } from "@material-ui/core";

import { setupMountedComponent } from "../../test";

import FiltersActions from "./filters-actions";

describe("<FiltersActions /> - Component", () => {
  let component;
  const props = {
    actions: [
      {
        id: "test",
        label: "Test Label",
        buttonProps: {
          onClick: () => {},
          variant: "test_variant"
        }
      }
    ]
  };

  before(() => {
    ({ component } = setupMountedComponent(FiltersActions, props, {}));
  });

  it("renders one Button", () => {
    expect(component.find(Button)).to.have.lengthOf(1);
  });
});
