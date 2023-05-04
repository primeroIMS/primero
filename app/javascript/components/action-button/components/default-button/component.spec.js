import { mountedComponent, screen } from "test-utils";
import DefaultButton from "./component";

describe("<DefaultButton /> components/action-button/components", () => {
  const props = {
    icon: <></>,
    isTransparent: false,
    cancel: true,
    pending: false,
    text: "Test",
    rest: {}
  };
  it("renders DefaultButton with text", () => {
    mountedComponent(<DefaultButton {...props} />);
    expect(screen.getByRole("button")).toHaveTextContent("Test");
  });

  it("renders a <Button /> and a <CircularProgress /> component", () => {
    const newProps = {
      ...props,
      pending: true
    };
    mountedComponent(<DefaultButton {...newProps} />);
    expect(screen.getAllByRole('progressbar')).toHaveLength(1);
    expect(screen.getByRole('button', { disabled: true })).toBeInTheDocument();
  });

  it("should contain .isTransparent class", () => {
    const newProps = {
      ...props,
      isTransparent: true
    };
    mountedComponent(<DefaultButton {...newProps} />);
    expect(screen.getAllByRole('button', { className: 'isTransparent' })).toHaveLength(1);
  });

  it("renders an default icon button class", () => {
    const newProps = {
      ...props,
      className: "MuiSvgIcon-root"
    };
    mountedComponent(<DefaultButton {...newProps} />);
    expect(screen.getByRole("button")).toHaveClass('MuiSvgIcon-root');
  });

  it("should contain .cancel class", () => {
    const newProps = {
      ...props,
      cancel: true
    };
    mountedComponent(<DefaultButton {...newProps} />);
    expect(screen.getAllByRole('button', { className: 'cancel' })).toHaveLength(1);
  });
});


