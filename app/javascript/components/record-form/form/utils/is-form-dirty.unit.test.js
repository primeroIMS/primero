import { List } from "immutable";

import isFormDirty from "./is-form-dirty";

describe("isFormDirty", () => {
  it("should return false if initialValues and currentValues are equals", () => {
    const initialValues = {
      field_1: "test"
    };

    const currentValues = {
      field_1: "test"
    };

    const fields = List([
      {
        name: "field_1",
        type: "text_field"
      }
    ]);

    expect(isFormDirty(initialValues, currentValues, fields)).to.be.false;
  });

  it("should return true if initialValues and currentValues are not equals", () => {
    const initialValues = {
      field_1: "test"
    };

    const currentValues = {
      field_1: "test 1"
    };

    const fields = List([
      {
        name: "field_1",
        type: "text_field"
      }
    ]);

    expect(isFormDirty(initialValues, currentValues, fields)).to.be.true;
  });

  context("when with subforms", () => {
    it(
      "should return false if initialValues and currentValues are equals, " +
        "even if currentValues subforms are in a differente order",
      () => {
        const initialValues = {
          field_1: "test",
          subform_1: [
            {
              subform_value: "test",
              order_field: "a"
            },
            {
              subform_value: "test",
              order_field: "b"
            }
          ]
        };

        const currentValues = {
          field_1: "test",
          subform_1: [
            {
              subform_value: "test",
              order_field: "b"
            },
            {
              subform_value: "test",
              order_field: "a"
            }
          ]
        };

        const fields = List([
          {
            name: "field_1"
          },
          {
            name: "subform_1",
            type: "subform",
            subform_section_configuration: { subform_sort_by: "order_field" }
          }
        ]);

        expect(isFormDirty(initialValues, currentValues, fields)).to.be.false;
      }
    );

    it(
      "should return true if initialValues and currentValues subform values are not equals, " +
        "even if currentValues subforms are in a differente order",
      () => {
        const initialValues = {
          field_1: "test",
          subform_1: [
            {
              subform_value: "test",
              order_field: "a"
            },
            {
              subform_value: "test",
              order_field: "b"
            }
          ]
        };

        const currentValues = {
          field_1: "test",
          subform_1: [
            {
              subform_value: "test 1",
              order_field: "b"
            },
            {
              subform_value: "test",
              order_field: "a"
            }
          ]
        };

        const fields = List([
          {
            name: "field_1"
          },
          {
            name: "subform_1",
            type: "subform",
            subform_section_configuration: { subform_sort_by: "order_field" }
          }
        ]);

        expect(isFormDirty(initialValues, currentValues, fields)).to.be.true;
      }
    );
  });
});
