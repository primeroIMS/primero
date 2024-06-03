// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { screen, mountedFieldComponent } from "test-utils";
import { fromJS } from "immutable";

import ErrorField from "./error-field";

describe("<Form /> - fields/<ErrorField />", () => {
  it("renders a error field if there are errors in the forms", () => {
    // eslint-disable-next-line react/display-name, react/no-multi-comp, react/prop-types
    const Component = ({ formMethods }) => <ErrorField errorsToCheck={fromJS(["name"])} formMethods={formMethods} />;

    mountedFieldComponent(<Component />, {
      errors: [
        {
          name: "name",
          message: "Name is required"
        }
      ]
    });
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("does not render the error field if the form doesn't have errors", () => {
    // eslint-disable-next-line react/display-name, react/no-multi-comp, react/prop-types
    const Component = ({ formMethods }) => <ErrorField formMethods={formMethods} errorsToCheck={fromJS(["name"])} />;

    mountedFieldComponent(<Component />);
    expect(document.querySelector(".MuiAlert-message")).toBeNull();
  });
});
