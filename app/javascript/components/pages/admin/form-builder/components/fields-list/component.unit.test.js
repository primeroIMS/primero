import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../../../../test";
import FieldListItem from "../field-list-item";

import FieldsList from "./component";

describe("<FieldsList />", () => {
  let component;

  const initialState = fromJS({
    records: {
      admin: {
        forms: {
          selectedFields: [
            { name: "field_1", editable: false },
            { name: "field_2", editable: true }
          ]
        }
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMockFormComponent(FieldsList, {}, {}, initialState));
  });

  it("should render the list items", () => {
    expect(component.find(FieldListItem)).to.have.lengthOf(2);
  });
});
