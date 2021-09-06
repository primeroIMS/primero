import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { FieldRecord, FormSectionRecord } from "../../../form";

import Table from "./component";

describe("components/record-actions/exports/components/pdf-exporter/components/table", () => {
  const classes = {
    subform: "subform",
    cell: "cell"
  };

  it("renders conditional subforms and fields", () => {
    const props = {
      classes,
      fields: [
        FieldRecord({
          display_name: "Test SubField",
          subform_section_id: FormSectionRecord({
            unique_id: "test_sub_form",
            fields: [
              FieldRecord({
                display_name: "Test Sub Field Allowed",
                name: "allowed_field",
                type: "text_field",
                visible: true
              }),
              FieldRecord({
                display_name: "Test Sub Field Disallowed",
                name: "disallowed_field",
                type: "text_field",
                visible: true
              })
            ]
          }),
          subform_section_configuration: {
            fields: ["allowed_field"],
            display_conditions: [
              {
                allowed_field: "josh"
              }
            ]
          },
          name: "test_subform",
          type: "subform"
        })
      ],
      record: fromJS({
        test_subform: [
          { allowed_field: "anthony", disallowed_field: "5555555", relation_is_caregiver: true },
          { allowed_field: "josh", disallowed_field: "5555555", relation_is_caregiver: false }
        ]
      })
    };
    const { component } = setupMountedComponent(Table, props);

    expect(component.html()).to.equal(
      // eslint-disable-next-line max-len
      `<h4>Test SubField</h4><div class="undefined"><div>Test Sub Field Allowed</div><div>josh</div></div><div></div>`
    );
  });

  it("renders key/value with string value", () => {
    const props = {
      classes,
      fields: [
        FieldRecord({
          display_name: "Test Field",
          name: "test_field",
          type: "text_field",
          visible: true
        }),
        FieldRecord({
          display_name: "Test SubField",
          subform_section_id: FormSectionRecord({
            unique_id: "test_sub_form",
            fields: [
              FieldRecord({
                display_name: "Test Sub Field",
                name: "test_sub_field",
                type: "text_field",
                visible: true
              })
            ]
          }),
          name: "test_subform",
          type: "subform"
        })
      ],
      record: fromJS({
        test_field: "josh",
        test_subform: [{ test_sub_field: "anthony" }]
      })
    };

    const { component } = setupMountedComponent(Table, props);

    expect(component.html()).to.equal(
      // eslint-disable-next-line max-len
      `<div class=""><div>Test Field</div><div>josh</div></div><h4>Test SubField</h4><div class="undefined"><div>Test Sub Field</div><div>anthony</div></div><div></div>`
    );
  });

  it("should not render fields with hide_on_view_page true", () => {
    const props = {
      classes,
      fields: [
        FieldRecord({
          display_name: "Test Field",
          name: "test_field",
          type: "text_field",
          visible: true
        }),
        FieldRecord({
          display_name: "Hidden Field",
          name: "hide_field",
          type: "text_field",
          visible: true,
          hide_on_view_page: true
        })
      ],
      record: fromJS({
        test_field: "josh",
        hidden_field: "testing"
      })
    };

    const { component } = setupMountedComponent(Table, props);

    expect(component.html()).to.equal('<div class=""><div>Test Field</div><div>josh</div></div>');
  });
});
