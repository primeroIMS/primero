import { screen, setupMockFormComponent } from "test-utils";

import FormAction from "./form-action";

describe("<Form /> - components/<FormAction />", () => {
  const buttonMessage = "Test save";
  const props = {
    actionHandler: () => {},
    text: buttonMessage
  };

  it("renders a Fab component", () => {
    setupMockFormComponent(FormAction, { props });
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText(buttonMessage)).toBeInTheDocument();
  });
});
