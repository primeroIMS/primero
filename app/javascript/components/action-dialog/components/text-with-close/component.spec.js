import { mountedComponent, screen } from "test-utils";
import TitleWithClose from "./component";

describe("<TitleWithClose />", () => {
  const props = {
    closeHandler: () => { },
    dialogSubtitle: "Test Subtitle",
    dialogTitle: "Test Title",
    dialogAction: <></>
  };

  beforeEach(() => {
    mountedComponent(<TitleWithClose {...props} />);
  });

  it("should render DialogTitle", () => {
    expect(screen.queryByText("Test Title")).toBeInTheDocument();
  });

  it("should render a title with subtitle", () => {
    expect(screen.queryByText("Test Subtitle")).toBeInTheDocument();
  });

  it("should render IconButton", () => {
    const newProps = {
      ...props,
      className: "MuiSvgIcon-root"
    };
    mountedComponent(<TitleWithClose {...newProps} />);
    expect(screen.getAllByRole('button', { className: 'MuiSvgIcon-root' })).toBeTruthy();
  });
});