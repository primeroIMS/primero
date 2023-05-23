import { screen, setupMockFieldComponent } from "test-utils";
import { FieldRecord } from "../records";
import CheckboxGroup from "./checkbox-group";

describe("form/fields/checkbox-group.jsx", () => {
    const options = [
        { id: 1, display_text: "option-1", tooltip: "option-1.tooltip" },
        { id: 2, display_text: "option-2" }
    ];

    it("renders checkbox inputs", () => {
        setupMockFieldComponent(
            CheckboxGroup,
            FieldRecord,
            {},
            { options, value: [1], onChange: () => { } }
        );
        expect(screen.getByText("option-1")).toBeInTheDocument();
    });

    it("renders checkbox inputs with tooltips", () => {
        setupMockFieldComponent(
            CheckboxGroup,
            FieldRecord,
            {},
            { options, value: [1], onChange: () => { } }
        );
        expect(screen.getByText("option-1")).toHaveAttribute("title", "option-1.tooltip");
    });
});