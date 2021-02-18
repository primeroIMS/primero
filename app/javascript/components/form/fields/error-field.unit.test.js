import { fromJS } from "immutable";
import Alert from "@material-ui/lab/Alert";

import { setupMockFieldComponent } from "../../../test";
import { FieldRecord } from "../records";

import ErrorField from "./error-field";

describe("<Form /> - fields/<ErrorField />", () => {
  it("renders a error field if there are errors in the forms", () => {
    const { component } = setupMockFieldComponent(
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

    expect(component.find(Alert)).to.have.lengthOf(1);
  });

  it("does not render the error field if the form doesn't have errors", () => {
    const { component } = setupMockFieldComponent(
      ({ formMethods }) => <ErrorField formMethods={formMethods} errorsToCheck={fromJS(["name"])} />,
      FieldRecord
    );

    expect(component.find(Alert)).to.be.empty;
  });
});
