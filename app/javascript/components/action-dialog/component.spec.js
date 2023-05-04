import { mountedComponent, screen } from "test-utils";
import ActionDialog from "./component";

describe("<ActionDialog />", () => {
  const props = {
    cancelHandler: () => { },
    children: [],
    confirmButtonLabel: "",
    confirmButtonProps: {},
    dialogActions: 'Test',
    dialogSubHeader: "Test SubHeader",
    dialogSubtitle: "Test Subtitle",
    dialogText: "",
    dialogTitle: "Test Title",
    disableActions: false,
    disableBackdropClick: false,
    maxSize: "sm",
    omitCloseAfterSuccess: false,
    onClose: () => { },
    open: true,
    pending: false,
    successHandler: () => { }
  };

  beforeEach(() => {
    mountedComponent(<ActionDialog {...props} />);
  });

  it("should render Dialog", () => {
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
  });

  it("should render DialogTitle", () => {
    expect(screen.getByRole("dialog")).toHaveTextContent("Test Title");
  });

  it("should render Submit Button", () => {
    const newProps = {
      ...props,
      className: "MuiSvgIcon-root"
    };
    mountedComponent(<ActionDialog {...newProps} />);
    expect(screen.getAllByRole('button', { className: 'MuiSvgIcon-root' })).toBeTruthy();
  });

  it("should render cancel Button", () => {
    expect(screen.queryByText("cancel")).toBeInTheDocument();
  });

  it('should accept valid props', () => {
    const newProps = {
      closeHandler: () => { },
      dialogSubHeader: "Test SubHeader",
      dialogSubtitle: "Test Subtitle",
      dialogTitle: "Test Title",
      disableActions: false,
      onClose: () => { },
      successHandler: () => { }
    };
    mountedComponent(<ActionDialog {...newProps} />);
    expect(newProps.closeHandler).toBeDefined();
    expect(newProps.dialogSubtitle).toBeDefined();
    expect(newProps.dialogTitle).toBeDefined();
    expect(newProps.dialogSubHeader).toBeDefined();
    expect(newProps.disableActions).toBeDefined();
    expect(newProps.successHandler).toBeDefined();
  });

  it("should render DialogSubtitle with it's correct value ", () => {
    expect(screen.getByRole("dialog")).toHaveTextContent("Test Subtitle");
  });

  it("should render dialogSubHeader with it's correct value ", () => {
    expect(screen.getByRole("dialog")).toHaveTextContent("Test SubHeader");
  });

  it("should not render DialogSubtitle because isn't passed in props ", () => {
    delete props.dialogSubtitle;
    mountedComponent(<ActionDialog {...props} />);
    expect(screen.getByRole("dialog")).not.toHaveClass('dialogSubtitle');
  });

  it("should not render dialogSubHeader because isn't passed in props ", () => {
    delete props.dialogSubHeader;
    mountedComponent(<ActionDialog {...props} />);
    expect(screen.getByRole("dialog")).not.toHaveClass('dialogSubHeader');
  });

  // it("should render DialogActions", () => {
  //   expect(component.find(DialogActions)).to.have.lengthOf(1);
  // });
});





