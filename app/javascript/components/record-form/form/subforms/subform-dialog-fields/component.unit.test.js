import { setupMountedComponent } from "../../../../../test";
import { FieldRecord, FormSectionRecord } from "../../../records";
import { TEXT_FIELD } from "../../../constants";
import TextField from "../../field-types/text-field";
import SubformField from "../component";
import SubformItem from "../subform-item";
import FormSectionField from "../../form-section-field";

import SubformDialogFields from "./component";
import { VIOLATION_IDS_NAME } from "./constants";

describe("<SubformDialogFields />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      SubformDialogFields,
      {
        field: {
          subform_section_id: {
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
                display_conditions_subform: { le: { age: 18 } }
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
      },
      {},
      [],
      { initialValues: {} }
    ));
  });

  it("render the <SubformDialogFields/> component", () => {
    expect(component.find(SubformDialogFields)).to.have.lengthOf(1);
  });

  it("only renders the fields that meet the conditions", () => {
    expect(component.find(TextField)).to.have.lengthOf(2);
  });

  describe("when a field of a subform is also a subform", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        SubformDialogFields,
        {
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
        },
        {},
        [],
        { registerField: () => {} }
      ));
    });

    it("render the SubformField", () => {
      expect(component.find(SubformField)).lengthOf(1);
    });

    it("render the subform", () => {
      expect(component.find(SubformItem)).lengthOf(1);
    });

    it("renders SubformField component with valid props", () => {
      const componentsProps = { ...component.find(SubformField).props() };

      [
        "name",
        "field",
        "mode",
        "index",
        "parentField",
        "disabled",
        "formSection",
        "isReadWriteForm",
        "recordModuleID",
        "recordType",
        "violationOptions",
        "forms",
        "parentTitle",
        "parentValues"
      ].forEach(property => {
        expect(componentsProps).to.have.property(property);
        delete componentsProps[property];
      });

      expect(componentsProps).to.be.empty;
    });
  });

  describe("when a field of a subform is called VIOLATION_IDS_NAME", () => {
    const parentViolationOptions = [{ id: 1, display_text: "test" }];

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        SubformDialogFields,
        {
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
        },
        {},
        [],
        { registerField: () => {} }
      ));
    });

    it("render the FormSectionField", () => {
      expect(component.find(FormSectionField)).lengthOf(1);
    });

    it("renders FormSectionField component with valid props", () => {
      const componentsProps = { ...component.find(FormSectionField).props() };

      [
        "name",
        "field",
        "mode",
        "index",
        "parentField",
        "disabled",
        "formSection",
        "isReadWriteForm",
        "recordModuleID",
        "recordType",
        "violationOptions"
      ].forEach(property => {
        expect(componentsProps).to.have.property(property);
        delete componentsProps[property];
      });

      expect(componentsProps).to.be.empty;
    });

    it("renders FormSectionField component with valid props", () => {
      const componentsProps = { ...component.find(FormSectionField).props() };

      expect(componentsProps.violationOptions).to.deep.equal(parentViolationOptions);
    });
  });
});
