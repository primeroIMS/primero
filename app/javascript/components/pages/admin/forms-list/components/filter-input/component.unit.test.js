import ToggleButton from "@material-ui/lab/ToggleButton";

import { setupMountedComponent } from "../../../../../../test";

import FilterInput from "./component";

describe("<FormsList />/components/<FilterInput />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(FilterInput, {
      id: "filter_1",
      name: "Filter 1",
      options: [
        {
          id: "option_1",
          displayName: "Option 1"
        },
        {
          id: "option_2",
          displayName: "Option 2"
        }
      ],
      handleSetFilterValue: () => {}
    }));
  });

  it("renders toggle input with options", () => {
    expect(component.find(FilterInput)).to.have.lengthOf(1);

    expect(component.find(ToggleButton)).to.have.lengthOf(2);
  });

  it.skip("responds to onChange with passed function", () => {});
});
