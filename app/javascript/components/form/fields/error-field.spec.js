import { screen, setupMockFieldComponent } from "test-utils";
import { FieldRecord } from "../records";
import ErrorField from "./error-field";
import { fromJS } from "immutable";

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

    // it("does not render the error field if the form doesn't have errors", () => {
    //     setupMockFieldComponent(
    //         ({ formMethods }) => <ErrorField formMethods={formMethods} errorsToCheck={fromJS(["name"])} />,
    //         FieldRecord
    //     );
    //     expect(screen.firstChild).toBeNull();
    // });
});