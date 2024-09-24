// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";

import SubformField from "../component";
import SubformItem from "../subform-item/component";
import SubformDialog from "../subform-dialog";
import SubformDialogFields from "../subform-dialog-fields";

import { EXPANDED } from "./constants";
import SubformFieldSubform from "./component";

describe("<SubformErrors />", () => {
  const props = {
    components: {
      SubformItem,
      SubformDialog,
      SubformDialogFields,
      SubformFieldSubform,
      SubformField
    },
    fieldProps: {
      field: {
        name: "test",
        displayName: {
          en: "Test"
        },
        collapsed: EXPANDED,
        subform_section_id: {
          unique_id: "subform-ABC",
          fields: []
        }
      },
      formSection: {
        unique_id: "ABC"
      },
      mode: {
        isShow: false
      }
    },
    isViolation: true,
    parentTitle: "",
    parentValues: [],
    violationOptions: []
  };

  it("render the SubformFieldSubform", () => {
    mountedComponent(<SubformFieldSubform {...props} />, {}, [], [], { initialValues: {} });
    expect(screen.getAllByTestId("subform-field-subform")).toHaveLength(1);
  });
});
