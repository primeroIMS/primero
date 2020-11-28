import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../../../../test";
import FormSection from "../../../../../form/components/form-section";

import SettingsTab from "./component";

describe("<SettingsTab />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMockFormComponent(
      SettingsTab,
      { index: 1, tab: 1, formContextFields: {}, fieldDialogMode: "new", mode: "isNew" },
      {},
      fromJS({}),
      {},
      true
    ));
  });

  it("should render <SettingsTab />", () => {
    expect(component.find(SettingsTab)).to.have.lengthOf(1);
  });

  it("should render <FormSection />", () => {
    expect(component.find(FormSection)).to.have.lengthOf(2);
  });
});
