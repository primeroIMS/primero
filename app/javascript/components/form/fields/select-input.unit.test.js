import { IconButton } from "@material-ui/core";
import { expect } from "chai";

import { FieldRecord } from "../records";
import { setupMockFieldComponent, setupMockFormComponent } from "../../../test";
import WatchedFormSectionField from "../components/watched-form-section-field";
import { SELECT_FIELD } from "../constants";

import SelectInput from "./select-input";

describe("<Form /> - fields/<SelectInput />", () => {
  const options = [
    { id: 1, display_text: "option-1" },
    { id: 2, display_text: "option-2" }
  ];

  it("renders select input", () => {
    const { component } = setupMockFieldComponent(SelectInput, FieldRecord, {}, { options });

    expect(component.exists("input")).to.be.true;
  });

  it("renders help text", () => {
    const { component } = setupMockFieldComponent(SelectInput, FieldRecord);

    expect(component.find("p.MuiFormHelperText-root").at(0).text()).to.include("Test Field 2 help text");
  });

  it("renders errors", () => {
    const { component } = setupMockFieldComponent(SelectInput, FieldRecord, {}, {}, {}, null, [
      {
        name: "test_field_2",
        message: "Name is required"
      }
    ]);

    expect(component.someWhere(n => n.find("Mui-error"))).to.be.true;
    expect(component.find("p.MuiFormHelperText-root").at(0).text()).to.include("Name is required");
  });

  it("renders required indicator", () => {
    const { component } = setupMockFieldComponent(SelectInput, FieldRecord);

    expect(component.find("span").at(1).text()).to.include("*");
  });

  it("should autoFocus when prop set", () => {
    const { component } = setupMockFieldComponent(SelectInput, FieldRecord);

    expect(component.find("input").props().autoFocus).to.be.true;
  });

  describe("when disabled options are present", () => {
    const withDisabledOption = [
      { id: 1, display_text: "option-1" },
      { id: 2, display_text: "option-2" },
      { id: 3, display_text: "option-3", disabled: true }
    ];
    const name = "test_field";

    context("when a disabled option was selected", () => {
      const { component } = setupMockFormComponent(WatchedFormSectionField, {
        props: {
          field: {
            name,
            display_name: "Test Field",
            disabled: false,
            type: SELECT_FIELD,
            options: withDisabledOption,
            watchedInputs: [name]
          }
        },
        defaultValues: { [name]: 3 },
        includeFormMethods: true
      });

      it("should render the disabled option if the selection is cleared", () => {
        const buttons = component.find(IconButton);

        // clear selection
        buttons.first().simulate("click");
        // open dropdown
        buttons.last().simulate("click");

        const renderedOptions = component.find("ul.MuiAutocomplete-groupUl > li");

        expect(renderedOptions).to.have.lengthOf(3);
        expect(renderedOptions.last().text()).to.equal("option-3");
      });

      it("should render the disabled option if the selection is changed", () => {
        // selects the first option
        component.find("ul.MuiAutocomplete-groupUl > li").first().simulate("click");

        const buttons = component.find(IconButton);

        // open dropdown
        buttons.last().simulate("click");

        const renderedOptions = component.find("ul.MuiAutocomplete-groupUl > li");

        expect(renderedOptions).to.have.lengthOf(2);
        expect(renderedOptions.last().text()).to.equal("option-3");
      });
    });

    context("when a disabled option was not selected", () => {
      const { component } = setupMockFormComponent(WatchedFormSectionField, {
        props: {
          field: {
            name,
            display_name: "Test Field",
            disabled: false,
            type: SELECT_FIELD,
            options: withDisabledOption,
            watchedInputs: [name]
          }
        },
        defaultValues: {},
        includeFormMethods: true
      });

      it("should not render the disabled options", () => {
        const buttons = component.find(IconButton);

        // clear selection
        buttons.first().simulate("click");
        // open dropdown
        buttons.last().simulate("click");

        const renderedOptions = component.find("ul.MuiAutocomplete-groupUl > li");

        expect(renderedOptions).to.have.lengthOf(2);
        expect(renderedOptions.map(elem => elem.text())).to.deep.equal(["option-1", "option-2"]);
      });
    });
  });
});
