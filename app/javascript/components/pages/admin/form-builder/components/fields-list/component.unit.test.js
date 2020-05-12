import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../../../../test";
import FieldListItem from "../field-list-item";

import FieldsList from "./component";

describe("<FieldsList />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMockFormComponent(
      FieldsList,
      {
        fields: fromJS([
          { name: "field_1", editable: false },
          { name: "field_2", editable: true }
        ])
      },
      fromJS({})
    ));
  });

  it("should render the list items", () => {
    expect(component.find(FieldListItem)).to.have.lengthOf(2);
  });
});
