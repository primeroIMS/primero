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
 
  it("renders transparent button", () => {
    const newProps = {
      ...props,
      isTransparent: true
    };     
    mountedComponent(<ActionButton {...newProps} />, state);
    expect(screen.getAllByRole('button', { className: 'isTransparent' })).toHaveLength(1);
  });

  it("should contain .cancel class", () => {
    const newProps = {
      ...props,
      cancel:true
    };
    mountedComponent(<ActionButton {...newProps} />, state);
    expect(screen.getAllByRole('button', { className: 'cancel' })).toHaveLength(1);   
  });

  it("renders an icon button", () => {
    const newProps = {
      ...props,
      className: "MuiSvgIcon-root"
    };
    mountedComponent(<ActionButton {...newProps} />, state);
    expect(screen.getByRole("button")).toHaveClass('MuiSvgIcon-root');
  }); 
  
  it.todo("renders outlined button");
  it.todo("renders a pending state");
});