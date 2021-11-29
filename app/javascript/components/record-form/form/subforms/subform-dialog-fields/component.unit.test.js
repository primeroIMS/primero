import { setupMountedComponent } from "../../../../../test";
import SubformField from "../component";
import SubformItem from "../subform-item";
import { FieldRecord, FormSectionRecord } from "../../../records";

import SubformDialogFields from "./component";

describe("<SubformDialogFields />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      SubformDialogFields,
      {
        field: { subform_section_id: { fields: [] } },
        mode: { isShow: true }
      },
      {},
      [],
      {}
    ));
  });

  it("render the <SubformDialogFields/> component", () => {
    expect(component.find(SubformDialogFields)).to.have.lengthOf(1);
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
