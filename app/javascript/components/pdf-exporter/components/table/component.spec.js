// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";

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
        {
          display_name: "Test SubField",
          subform_section_id: {
            unique_id: "test_sub_form",
            fields: [
              {
                display_name: "Test Sub Field Allowed",
                name: "allowed_field",
                type: "text_field",
                visible: true
              },
              {
                display_name: "Test Sub Field Disallowed",
                name: "disallowed_field",
                type: "text_field",
                visible: true
              }
            ]
          },
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
        }
      ],
      record: fromJS({
        test_subform: [
          { allowed_field: "anthony", disallowed_field: "5555555", relation_is_caregiver: true },
          { allowed_field: "josh", disallowed_field: "5555555", relation_is_caregiver: false }
        ]
      })
    };

    mountedComponent(<Table {...props} />);

    expect(screen.getByText("Test SubField")).toBeInTheDocument();
  });

  it("renders key/value with string value", () => {
    const props = {
      classes,
      fields: [
        {
          display_name: "Test Field",
          name: "test_field",
          type: "text_field",
          visible: true
        },
        {
          display_name: "Test SubField",
          subform_section_id: {
            unique_id: "test_sub_form",
            fields: [
              {
                display_name: "Test Sub Field",
                name: "test_sub_field",
                type: "text_field",
                visible: true
              }
            ]
          },
          name: "test_subform",
          type: "subform"
        }
      ],
      record: fromJS({
        test_field: "josh",
        test_subform: [{ test_sub_field: "anthony" }]
      })
    };

    mountedComponent(<Table {...props} />);

    expect(screen.getByText("Test Field")).toBeInTheDocument();
    expect(screen.getByText(/anthony/i)).toBeInTheDocument();
  });

  it("should not render fields with hide_on_view_page true", () => {
    const props = {
      classes,
      fields: [
        {
          display_name: "Test Field",
          name: "test_field",
          type: "text_field",
          visible: true
        },
        {
          display_name: "Hidden Field",
          name: "hide_field",
          type: "text_field",
          visible: true,
          hide_on_view_page: true
        }
      ],
      record: fromJS({
        test_field: "josh",
        hidden_field: "testing"
      })
    };

    mountedComponent(<Table {...props} />);

    expect(screen.getByText("Test Field")).toBeInTheDocument();
    expect(screen.getByText(/josh/i)).toBeInTheDocument();
  });
});
