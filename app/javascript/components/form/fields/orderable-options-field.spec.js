import { screen, mountedFormComponent } from "test-utils";

import OrderableOptionsField from "./orderable-options-field";

describe("<Form /> - fields/<OrderableOptionsField />", () => {
  beforeEach(() => {
    mountedFormComponent(
      <OrderableOptionsField
        {...{
          inputProps: {
            commonInputProps: { name: "field_1" },
            metaInputProps: { selectedValue: "option_2", showDefaultAction: true }
          }
        }}
      />,
      {
        defaultValues: {
          field_1: [
            { id: "option_1", display_text: { en: "Display text 1" } },
            { id: "option_2", display_text: { en: "Display text 2" } },
            { id: "option_3", display_text: { en: "Display text 3" } }
          ]
        }
      }
    );
  });

  it("renders the options", () => {
    expect(screen.getByText("fields.english_text")).toBeInTheDocument();
  });

  it("renders the action buttons", () => {
    expect(screen.getAllByRole("button")).toBeTruthy();
  });

  it.todo("render the values for the field");
});
