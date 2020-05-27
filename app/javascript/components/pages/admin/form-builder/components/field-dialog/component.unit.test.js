import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../../../../test";

import FieldDialog from "./component";

describe("<FieldDialog />", () => {
  let component;

  const initialState = fromJS({
    ui: { dialogs: { admin_fields_dialog: true } }
  });

  beforeEach(() => {
    ({ component } = setupMockFormComponent(FieldDialog, {}, {}, initialState));
  });

  it("should render the dialog", () => {
    expect(component.find(FieldDialog)).to.have.lengthOf(1);
  });
});
