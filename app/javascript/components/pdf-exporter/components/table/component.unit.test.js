import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { FieldRecord, FormSectionRecord } from "../../../form";

import Table from "./component";

describe("components/record-actions/exports/components/pdf-exporter/components/table", () => {
  it("renders key/value with string value", () => {
    const props = {
      classes: {
        subform: "subform",
        cell: "cell"
      },
      fields: [
        FieldRecord({
          display_name: "Test Field",
          name: "test_field",
          type: "text_field",
          visible: true
        }),
        FieldRecord({
          display_name: "Test SubField",
          subform_section_id: FormSectionRecord({
            unique_id: "test_sub_form",
            fields: [
              FieldRecord({
                display_name: "Test Sub Field",
                name: "test_sub_field",
                type: "text_field",
                visible: true
              })
            ]
          }),
          name: "test_subform",
          type: "subform"
        })
      ],
      record: fromJS({
        test_field: "josh",
        test_sub_form: [{ test_sub_field: "anthony" }]
      })
    };

    const { component } = setupMountedComponent(Table, props);

    expect(component.html()).to.equal(
      // eslint-disable-next-line max-len
      `<div class=""><div>Test Field</div><div>josh</div></div><h4>Test SubField</h4><div class="undefined"><div>Test Sub Field</div><div>anthony</div></div>`
    );
  });
});
