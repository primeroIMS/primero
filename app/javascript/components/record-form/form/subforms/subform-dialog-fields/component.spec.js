import { fromJS } from "immutable";

import { mountedComponent, screen, userEvent } from "../../../../../test-utils";
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
      formSection: { unique_id: "test_id" },
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
              display_name: { en: "Perpetrators Subform" },
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
      expect(screen.getByTestId("subform-field-subform")).toBeInTheDocument();
    });

    it("render the SubformField", () => {
      mountedComponent(<SubformDialogFields {...subFormProps} />, {}, [], {}, { registerField: () => {} });
      expect(screen.getByTestId("subform-field")).toBeInTheDocument();
    });

    it("render the subform", () => {
      mountedComponent(<SubformDialogFields {...subFormProps} />, {}, [], {}, { registerField: () => {} });
      expect(screen.getByText("Perpetrators Subform")).toBeInTheDocument();
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

  describe("when a field has tag properties", () => {
    const tagProps = {
      mode: { isEdit: true },
      formSection: { unique_id: "test_id" },
      field: FieldRecord({
        name: "attack_on_hospitals",
        subform_section_id: FormSectionRecord({
          unique_id: "attack_on_hospitals",
          fields: [
            FieldRecord({
              name: "facility_attack_type",
              visible: true,
              type: "select_box",
              multiple: true,
              option_strings_source: "lookup lookup-facility-attack-type",
              option_strings_condition: {
                hospitals: { in: { violation_category: ["attack_on_hospitals"] } }
              }
            })
          ]
        })
      }),
      recordType: "cases",
      recordModuleID: "primeromodule-cp",
      values: {},
      parentValues: {
        violation_category: ["attack_on_hospitals", "killing"]
      }
    };

    const stateWithLookups = fromJS({
      forms: {
        options: {
          lookups: [
            {
              id: 1,
              name: { en: "Facility Attack Type" },
              unique_id: "lookup-facility-attack-type",
              values: [
                { id: "attack_on_hospitals", display_text: { en: "Attack on hospitals" }, tags: ["hospitals"] },
                { id: "other", display_text: { en: "Other" }, tags: [] }
              ]
            }
          ]
        }
      }
    });

    it("renders the options tagged as hospitals if the condition is met", async () => {
      mountedComponent(<SubformDialogFields {...tagProps} />, stateWithLookups, [], {}, { registerField: () => {} });
      const user = userEvent.setup();

      const autoCompleteDropdown = screen.getByRole("button", { name: "Open" });

      await user.click(autoCompleteDropdown);

      expect(screen.getByText("Attack on hospitals")).toBeInTheDocument();
    });

    it("renders all options if the condition is not met", async () => {
      mountedComponent(
        <SubformDialogFields {...{ ...tagProps, parentValues: {} }} />,
        stateWithLookups,
        [],
        {},
        { registerField: () => {} }
      );
      const user = userEvent.setup();

      const autoCompleteDropdown = screen.getByRole("button", { name: "Open" });

      await user.click(autoCompleteDropdown);

      expect(screen.getByText("Attack on hospitals")).toBeInTheDocument();
      expect(screen.getByText("Other")).toBeInTheDocument();
    });
  });
});
