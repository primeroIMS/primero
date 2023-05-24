import { screen, setupMockFieldComponent } from "test-utils";
import { FieldRecord } from "../records";
import DialogTrigger from "./dialog-trigger";

describe("form/fields/dialog-trigger.jsx", () => {
    const props = {
        commonInputProps: {
            label: "Test label"
        },
        metaInputProps: {
            onClick: () => { }
        }
    };

    it("renders button component with text", () => {
        setupMockFieldComponent(DialogTrigger, FieldRecord, {}, props);
        expect(screen.getByText("Test label")).toBeInTheDocument();
    });
});