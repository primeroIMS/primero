import { setupMountedComponent } from "../../../../../test";

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
});
