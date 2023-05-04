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

  it('should accept valid props', () => {
    const newProps = {
      closeHandler: () => { },
      dialogAction: 'submit',
      dialogSubtitle: 'Testing Valid SubTitle',
      dialogTitle: 'Testing Valid Title',
      disableClose: false
    };
    mountedComponent(<TitleWithClose {...newProps} />);
    expect(newProps.closeHandler).toBeDefined();
    expect(newProps.dialogAction).toBeDefined();
    expect(newProps.dialogSubtitle).toBeDefined();
    expect(newProps.dialogTitle).toBeDefined();
    expect(newProps.disableClose).toBeDefined();
  });
});