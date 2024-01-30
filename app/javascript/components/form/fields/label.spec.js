import { screen, mountedComponent } from "test-utils";
import { fromJS } from "immutable";

import Label from "./label";

describe("<Label />", () => {
  const initialState = fromJS({});
  const commonInputProps = {
    label: "Some text"
  };

  beforeEach(() => {
    mountedComponent(<Label commonInputProps={commonInputProps} />, initialState);
  });

  it("renders the Label", () => {
    expect(screen.getByText("Some text")).toBeInTheDocument();
  });
});
