import { screen, setupMockFieldComponent } from "test-utils";
import { FieldRecord } from "../records";
import CheckboxInput from "./checkbox-input";

describe("<Form /> - fields/<SelectInput />", () => {
    const options = [
      { id: 1, display_text: "option-1" },
      { id: 2, display_text: "option-2" }
    ];

    // it("renders checkbox inputs", () => {
    //     const { component } = setupMockFieldComponent(CheckboxInput, FieldRecord, {}, { options });
    
    //     expect(component.find("input")).to.be.lengthOf(2);
    //   });

    // it("renders checkbox inputs", () => {
    //     setupMockFieldComponent(
    //         CheckboxGroup,
    //         FieldRecord,
    //         {},
    //         { options, value: [1], onChange: () => { } }
    //     );
    //     expect(screen.getByText("option-1")).toBeInTheDocument();
    // });

    // it("renders checkbox inputs with tooltips", () => {
    //     setupMockFieldComponent(
    //         CheckboxGroup,
    //         FieldRecord,
    //         {},
    //         { options, value: [1], onChange: () => { } }
    //     );
    //     expect(screen.getByText("option-1")).toHaveAttribute("title", "option-1.tooltip");
    // });
});