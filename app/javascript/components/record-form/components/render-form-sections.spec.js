// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { FormSectionRecord, FieldRecord } from "../records";
import { TEXT_FIELD } from "../constants";
import { mountedComponent, screen } from "../../../test-utils";

import renderFormSections from "./render-form-sections";

describe("renderFormSections()", () => {
  it("does not render the fields that do not meet the conditions", () => {
    const externalForms = () => {};
    const selectedForm = "form1";
    const userPermittedFormsIds = fromJS({ selectedForm: "rw" });
    const mobileDisplay = false;
    const handleToggleNav = () => {};
    const i18n = () => {};
    const recordType = "recordType1";
    const attachmentForms = [];
    const mode = { isEdit: true };
    const record = fromJS({});
    const primeroModule = "primeroModule1";

    const formSectionsRender = renderFormSections(
      externalForms,
      selectedForm,
      userPermittedFormsIds,
      mobileDisplay,
      handleToggleNav,
      i18n,
      recordType,
      attachmentForms,
      mode,
      record,
      primeroModule
    );

    const formSection = () =>
      formSectionsRender(
        [
          FormSectionRecord({
            unique_id: "form1",
            visible: true,
            fields: [
              FieldRecord({
                name: "field1",
                type: TEXT_FIELD,
                visible: true,
                display_conditions_record: { eq: { sex: "male" } }
              }),
              FieldRecord({
                name: "field2",
                type: TEXT_FIELD,
                visible: true,
                display_conditions_record: { le: { age: 18 } }
              }),
              FieldRecord({ name: "field3", type: TEXT_FIELD, visible: true })
            ]
          })
        ],
        () => {},
        () => {},
        { sex: "male", age: 19 },
        false
      );

    // eslint-disable-next-line react/display-name
    function RenderedFormSections() {
      return <>{formSection()}</>;
    }

    mountedComponent(<RenderedFormSections />, {}, {}, [], { initialValues: {} });

    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });

  it("renders summary fields disabled", () => {
    const externalForms = () => {};
    const selectedForm = "form1";
    const userPermittedFormsIds = fromJS({ form1: "rw" });
    const mobileDisplay = false;
    const handleToggleNav = () => {};
    const i18n = () => {};
    const recordType = "recordType1";
    const attachmentForms = [];
    const mode = { isEdit: true };
    const record = fromJS({});
    const primeroModule = "primeroModule1";

    const formSectionsRender = renderFormSections(
      externalForms,
      selectedForm,
      userPermittedFormsIds,
      mobileDisplay,
      handleToggleNav,
      i18n,
      recordType,
      attachmentForms,
      mode,
      record,
      primeroModule
    );

    const formSection = () =>
      formSectionsRender(
        [
          FormSectionRecord({
            unique_id: "form1",
            visible: true,
            fields: [
              FieldRecord({
                name: "field1",
                type: TEXT_FIELD,
                visible: true
              }),
              FieldRecord({
                name: "field2",
                type: TEXT_FIELD,
                visible: true,
                subform_summary: { subform_field_name: "subform_1" }
              })
            ]
          })
        ],
        () => {},
        () => {},
        { sex: "male", age: 19 },
        false
      );

    // eslint-disable-next-line react/display-name
    function RenderedFormSections() {
      return <>{formSection()}</>;
    }

    mountedComponent(<RenderedFormSections />, {}, {}, [], { initialValues: {} });

    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(screen.getAllByRole("textbox")[1]).toHaveClass("Mui-disabled");
  });

  it("renders fields disabled when disabled is true", () => {
    const externalForms = () => {};
    const selectedForm = "form1";
    const userPermittedFormsIds = fromJS({ form1: "rw" });
    const mobileDisplay = false;
    const handleToggleNav = () => {};
    const i18n = () => {};
    const recordType = "recordType1";
    const attachmentForms = [];
    const mode = { isEdit: true };
    const record = fromJS({});
    const primeroModule = "primeroModule1";

    const formSectionsRender = renderFormSections(
      externalForms,
      selectedForm,
      userPermittedFormsIds,
      mobileDisplay,
      handleToggleNav,
      i18n,
      recordType,
      attachmentForms,
      mode,
      record,
      primeroModule
    );

    const formSection = () =>
      formSectionsRender(
        [
          FormSectionRecord({
            unique_id: "form1",
            visible: true,
            fields: [
              FieldRecord({
                name: "field1",
                type: TEXT_FIELD,
                visible: true,
                disabled: true
              }),
              FieldRecord({
                name: "field2",
                type: TEXT_FIELD,
                visible: true
              })
            ]
          })
        ],
        () => {},
        () => {},
        { sex: "male", age: 19 },
        false
      );

    // eslint-disable-next-line react/display-name
    function RenderedFormSections() {
      return <>{formSection()}</>;
    }

    mountedComponent(<RenderedFormSections />, {}, {}, [], { initialValues: {} });

    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(screen.getAllByRole("textbox")[0]).toHaveClass("Mui-disabled");
  });
});
