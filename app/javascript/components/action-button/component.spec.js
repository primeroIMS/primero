import { mountedComponent, screen } from "test-utils";

import ActionButton from "./component";
import { ACTION_BUTTON_TYPES } from "./constants";

describe("<ActionButton />", () => {
  const props = {
    icon: <></>,
    cancel: false,
    isTransparent: false,
    pending: false,
    text: "Test Button",
    type: ACTION_BUTTON_TYPES.default,
    rest: {}
  };
  const state = {
    application: {
      disableApplication: false
    }
  };

  it("renders DefaultButton with text", () => {
    mountedComponent(<ActionButton {...props} />, state);
    expect(screen.getByRole("button")).toHaveTextContent("Test Button");
  });

  it("should not render Action button if rest.hide is true", () => {
    const newProps = {
      ...props,
      rest: { hide: true }
    };

    mountedComponent(<ActionButton {...newProps} />, state);
    expect(screen.queryByText("Test Button")).not.toBeInTheDocument();
  });

  // Check if transparent class is set
  it.todo("renders transparent button");

  // Check if outlined class is set
  it.todo("renders outlined button");

  it.todo("renders a pending state");

  it.todo("triggers a passed cancel function");

  // check if svg or certain class for icon
  it.todo("renders an icon button");
});
