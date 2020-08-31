import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../../../../test";

import SubformFieldList from "./component";

describe("<SubformFieldList />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMockFormComponent(SubformFieldList, { formContextFields: {} }, {}, fromJS({}), {}, true));
  });

  it("should render <SettingsTab />", () => {
    expect(component.find(SubformFieldList)).to.have.lengthOf(1);
  });
});
