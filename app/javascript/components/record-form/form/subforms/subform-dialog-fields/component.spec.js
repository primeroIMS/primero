import { mountedComponent, screen } from "../../../../../test-utils";
import { FieldRecord, FormSectionRecord } from "../../../records";
import { TEXT_FIELD } from "../../../constants";

import SubformDialogFields from "./component";
import { VIOLATION_IDS_NAME } from "./constants";

describe("<SubformDialogFields />", () => {
  const props = {
    field: {
      subform_section_id: {
        fields: [
          FieldRecord({
            name: "field1",
            type: TEXT_FIELD,
            visible: true,
            display_conditions_record: { disabled: false, eq: { sex: "male" } }
          }),
          FieldRecord({
            name: "field2",
            type: TEXT_FIELD,
            visible: true,
            display_conditions_subform: { disabled: false, le: { age: 18 } }
          }),
          FieldRecord({ name: "field3", type: TEXT_FIELD, visible: true })
        ]
      }
    },
    mode: { isShow: true },
    values: { age: 15, unique_id: "abc123def" },
    parentValues: { sex: "female" },
    recordType: "cases",
    recordModuleID: "primeromodule-cp"
  };

  it("render the <SubformDialogFields/> component", () => {
    mountedComponent(<SubformDialogFields {...props} />, {}, [], {}, { initialValues: {} });
    expect(screen.getAllByTestId("subform-dialog-field")).toHaveLength(2);
  });

  it("only renders the fields that meet the conditions", () => {
    mountedComponent(<SubformDialogFields {...props} />, {}, [], {}, { initialValues: {} });
    expect(screen.getAllByTestId("text-field")).toHaveLength(2);
  });

  describe("when a field of a subform is also a subform", () => {
    const subFormProps = {
      mode: { isShow: true },
      formSection: { unqique_id: "test_id" },
      recordType: "cases",
      recordModuleID: "primeromodule-cp",
      parentValues: {},
      field: FieldRecord({
        name: "killing",
        subform_section_id: FormSectionRecord({
          unique_id: "killing",
          fields: [
            FieldRecord({
              name: "perpetrators",
              unique_id: "perpetratorsId",
              visible: true,
              type: "subform",
              subform_section_id: FormSectionRecord({
                unique_id: "perpetrators",
                fields: [
                  FieldRecord({
                    name: "perpetrators",
                    unique_id: "perpetratorsId",
                    visible: true,
                    type: "separator"
                  })
                ]
              })
            })
          ]
        })
      })
    };

    it("render the SubformFieldSubform", () => {
      mountedComponent(<SubformDialogFields {...subFormProps} />, {}, [], {}, { registerField: () => {} });
      expect(screen.getByTestId("subform-field-subform")).toBeInTheDocument(1);
    });
  });

  describe("when a field of a subform is called VIOLATION_IDS_NAME", () => {
    const parentViolationOptions = [{ id: 1, display_text: "test" }];

    const violationProps = {
      mode: { isEdit: true },
      formSection: { unqique_id: "test_id" },
      field: FieldRecord({
        name: "killing",
        subform_section_id: FormSectionRecord({
          unique_id: "killing",
          fields: [
            FieldRecord({
              name: VIOLATION_IDS_NAME,
              unique_id: "perpetratorsId",
              visible: true,
              type: "select_box",
              multiple: true
            })
          ]
        })
      }),
      recordType: "cases",
      recordModuleID: "primeromodule-cp",
      parentViolationOptions
    };

    it("render the FormSectionField", () => {
      mountedComponent(<SubformDialogFields {...violationProps} />, {}, [], {}, { registerField: () => {} });
      expect(screen.getAllByTestId("form-section-field")).toHaveLength(1);
    });
  });
});
