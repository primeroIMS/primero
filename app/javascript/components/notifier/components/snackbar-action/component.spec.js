import { mountedComponent, screen } from "../../../../test-utils";

import SnackbarAction from "./component";

const props = {
  actionLabel: "Test",
  actionUrl: "/test",
  closeSnackbar: () => {},
  key: 1234,
  hideCloseIcon: false
};

describe("<SnackbarAction />", () => {
  it("should render 1 Button component", () => {
    mountedComponent(<SnackbarAction {...props} />);
    expect(screen.getByTestId(/snackbar-action/i)).toBeInTheDocument();
  });

  it("should render 1 IconButton component", () => {
    mountedComponent(<SnackbarAction {...props} />);
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "svg")).toBeInTheDocument();
  });

  describe("when hideCloseIcon is true", () => {
    const propsHide = {
      actionLabel: "Test",
      actionUrl: "/test",
      closeSnackbar: () => {},
      key: 1234,
      hideCloseIcon: true
    };

    it("should render 1 Button component", () => {
      mountedComponent(<SnackbarAction {...propsHide} />);
      expect(screen.getByTestId(/snackbar-action/i)).toBeInTheDocument();
    });

    it("should not render IconButton component", () => {
      mountedComponent(<SnackbarAction {...propsHide} />);
      expect(screen.queryByText((content, element) => element.tagName.toLowerCase() === "svg")).toBeNull();
    });
  });
});
