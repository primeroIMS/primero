import { setupMountedComponent } from "../../../../../test";
import { FieldRecord, FormSectionRecord } from "../../../records";
import { TEXT_FIELD } from "../../../constants";
import TextField from "../../field-types/text-field";
import SubformField from "../component";
import SubformItem from "../subform-item";

import SubformDialogFields from "./component";

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
        values: { age: 15 },
        parentValues: { sex: "female" }
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
  });
});
