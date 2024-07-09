import { screen, mountedFieldComponent } from "test-utils";

import LinkField from "./link-field";

describe("<Form /> - fields/<LinkField />", () => {
  it("renders the link", () => {
    mountedFieldComponent(<LinkField />);
    expect(screen.getByText("Test Field 2")).toBeInTheDocument();
  });
});
