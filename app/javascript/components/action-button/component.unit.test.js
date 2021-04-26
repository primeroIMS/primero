import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";

import { DefaultButton, IconButton } from "./components";
import ActionButton from "./component";
import { ACTION_BUTTON_TYPES } from "./constants";

describe("<ActionButton />", () => {
  const props = {
    icon: <></>,
    isCancel: false,
    isTransparent: false,
    pending: false,
    text: "Test",
    type: ACTION_BUTTON_TYPES.default,
    rest: {}
  };
  const state = fromJS({
    application: {
      disableApplication: false
    }
  });

  it("renders DefaultButton type", () => {
    const { component } = setupMountedComponent(ActionButton, props, state);

    expect(component.find(DefaultButton)).to.have.lengthOf(1);
  });

  it("renders IconButton type", () => {
    const { component } = setupMountedComponent(
      ActionButton,
      {
        ...props,
        type: ACTION_BUTTON_TYPES.icon
      },
      fromJS({
        application: {
          disableApplication: true
        }
      })
    );

    expect(component.find(IconButton)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const { component } = setupMountedComponent(ActionButton, props, state);
    const componentsProps = { ...component.find(ActionButton).props() };

    ["icon", "isCancel", "isTransparent", "pending", "text", "type", "outlined", "rest"].forEach(property => {
      expect(componentsProps).to.have.property(property);
      delete componentsProps[property];
    });
    expect(componentsProps).to.be.empty;
  });

  it("should not render Action button if rest.hide is true", () => {
    const newProps = {
      ...props,
      rest: { hide: true }
    };
    const { component } = setupMountedComponent(ActionButton, newProps);

    expect(component.find(IconButton)).to.be.empty;
  });
});
