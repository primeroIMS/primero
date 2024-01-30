import { screen, setupMockFieldComponent } from "test-utils";
import { fromJS } from "immutable";

import { FieldRecord } from "../records";

import ErrorField from "./error-field";

describe("<Form /> - fields/<ErrorField />", () => {
  it("renders a error field if there are errors in the forms", () => {
    setupMockFieldComponent(
      ({ formMethods }) => <ErrorField errorsToCheck={fromJS(["name"])} formMethods={formMethods} />,
      FieldRecord,
      {},
      {},
      {},
      null,
      [
        {
          name: "name",
          message: "Name is required"
        }
      ]
    );
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  xit("does not render the error field if the form doesn't have errors", () => {
    setupMockFieldComponent(
      ({ formMethods }) => <ErrorField formMethods={formMethods} errorsToCheck={fromJS(["name"])} />,
      FieldRecord
    );
    expect(screen.firstChild).toBeNull();
  });
});
