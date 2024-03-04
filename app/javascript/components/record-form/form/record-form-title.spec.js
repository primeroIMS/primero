import { mountedComponent, screen } from "../../../test-utils";

import RecordFormTitle from "./record-form-title";

describe("<RecordFormTitle />", () => {
  const props = {
    displayText: "Test title",
    handleToggleNav: () => {},
    mobileDisplay: true
  };

  it("renders a <IconButton />", () => {
    mountedComponent(<RecordFormTitle {...props} />, {});
    expect(screen.getByTestId("icon-button")).toBeInTheDocument();
  });

  it("renders a <MenuOpen />", () => {
    mountedComponent(<RecordFormTitle {...props} />, {});
    expect(screen.getByTestId("menu-open")).toBeInTheDocument();
  });

  it("renders a valid text passed as a prop", () => {
    mountedComponent(<RecordFormTitle {...props} />, {});
    expect(screen.queryByText("Test title")).toBeInTheDocument();
  });
});
