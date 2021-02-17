import { CircularProgress } from "@material-ui/core";

import { setupMockFormComponent } from "../../../test";
import ActionButton from "../../action-button";

import FormAction from "./form-action";

describe("<Form /> - components/<FormAction />", () => {
  const buttonMessage = "Test save";
  const props = {
    actionHandler: () => {},
    text: buttonMessage
  };

  it("renders a Fab component", () => {
    const { component } = setupMockFormComponent(FormAction, { props });
    const button = component.find(ActionButton);

    expect(button).to.have.lengthOf(1);
    expect(button.text()).to.be.equals(buttonMessage);
  });

  it(
    "renders a ActionButton with a CircularProgress component, " +
      "when savingRecord it's true and it's not a cancel button",
    () => {
      const { component } = setupMockFormComponent(FormAction, {
        props: {
          ...props,
          cancel: false,
          savingRecord: true
        }
      });
      const button = component.find(ActionButton);

      expect(button).to.have.lengthOf(1);
      expect(button.text()).to.be.equals(buttonMessage);
      expect(component.find(CircularProgress)).to.have.lengthOf(1);
    }
  );
});
