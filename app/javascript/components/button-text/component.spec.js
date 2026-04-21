import { mountedComponent, screen } from "test-utils";

import ButtonText from "./component";

describe("<ButtonText />", () => {
  const props = {
    text: "Test Title"
  };

  beforeEach(() => {
    mountedComponent(<ButtonText {...props} />);
  });

  it("should render text", () => {
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });
});
