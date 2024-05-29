import { mountedComponent, screen } from "test-utils";

import FilterInput from "./component";

describe("<FormsList />/components/<DragIndicator />", () => {
  beforeEach(() => {
    const props = {
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
    };

    mountedComponent(<FilterInput {...props} />);
  });

  it("renders toggle input with options", () => {
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });
});
