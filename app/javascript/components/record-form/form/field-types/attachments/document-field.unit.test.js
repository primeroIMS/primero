// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { FastField } from "formik";

import { setupMountedComponent } from "../../../../../test";
import { FieldRecord } from "../../../records";
import TickField from "../tick-field";
import DateField from "../date-field";
import { MODULES } from "../../../../../config";

import DocumentField from "./document-field";

describe("<DocumentField />", () => {
  const props = {
    name: "attachment_field_test",
    title: "title",
    index: 0,
    field: FieldRecord({
      date_include_time: false,
      selected_value: "",
      type: "date_field"
    }),
    arrayHelpers: {
      form: {
        values: {
          module_id: MODULES.CP
        }
      }
    },
    value: {
      is_current: false,
      file_name: "dummy.pdf",
      date: "2022-06-07",
      field_name: "upload_supporting_material",
      record: {
        id: "7d34b080-60bb-45e5-9ac3-197f66b3d5e6",
        enabled: true,
        last_updated_at: "2022-06-07T21:46:44.917Z"
      },
      attachment_url: "test",
      comments: "random comment",
      id: 3,
      description: "test docuemnt"
    },
    resetOpenLastDialog: () => {},
    open: true,
    mode: {
      isShow: true,
      isEdit: false
    },
    attachment: ""
  };

  const formProps = {
    initialValues: {}
  };

  it("should render a DocumentField", () => {
    const { component } = setupMountedComponent(DocumentField, props, {}, [], formProps);

    expect(component.find(DateField)).to.have.lengthOf(1);
    expect(component.find(FastField)).to.have.lengthOf(4);
    expect(component.find(TickField)).to.have.lengthOf(1);
  });

  it("should NOT render render a TickField", () => {
    const propsMRM = {
      ...props,
      arrayHelpers: {
        form: {
          values: {
            module_id: MODULES.MRM
          }
        }
      }
    };
    const { component } = setupMountedComponent(DocumentField, propsMRM, {}, [], formProps);

    expect(component.find(TickField)).to.have.lengthOf(0);
  });
});
