import { setupMountedComponent } from "../../../../../test";

import SubformFieldSubform from "./component";
import { EXPANDED } from "./constants";

describe("<SubformErrors />", () => {
  const props = {
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

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(SubformFieldSubform, props));
  });

  it("render the SubformFieldSubform", () => {
    expect(component.find(SubformFieldSubform)).lengthOf(1);
  });
});
