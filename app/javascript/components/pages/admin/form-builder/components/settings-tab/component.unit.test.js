import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../../../../test";

import SettingsTab from "./component";

describe("<SettingsTab />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMockFormComponent(
      SettingsTab,
      { index: 1, tab: 1, formContextFields: {}, fieldDialogMode: "new" },
      {},
      fromJS({}),
      {},
      true
    ));
  });

  it("should render <SettingsTab />", () => {
    expect(component.find(SettingsTab)).to.have.lengthOf(1);
  });
});
