import { mountedComponent, screen } from "test-utils";
import IconButton from "./component";

describe("<IconButton /> components/action-button/components", () => {
  const props = {
    icon: <></>,
    isTransparent: false,
    rest: {}
  };
  it("renders a <IconButton /> component", () => {
    const newProps = {
      ...props,
      className: "MuiSvgIcon-root"
    };
    mountedComponent(<IconButton {...newProps} />);
    expect(screen.getByRole("button")).toHaveClass('MuiSvgIcon-root');
  });
});
