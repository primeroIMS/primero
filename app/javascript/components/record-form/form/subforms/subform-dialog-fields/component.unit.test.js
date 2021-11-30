import { setupMountedComponent } from "../../../../../test";
import { FieldRecord } from "../../../records";
import { TEXT_FIELD } from "../../../constants";
import TextField from "../../field-types/text-field";

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
});
