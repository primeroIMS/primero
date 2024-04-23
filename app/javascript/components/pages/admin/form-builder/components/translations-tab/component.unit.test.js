// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { setupMockFormComponent } from "../../../../../../test";

import TranslationsTab from "./component";

describe("<TranslationsTab />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMockFormComponent(TranslationsTab, {
      props: {
        index: 1,
        tab: 1,
        formContextFields: {},
        fieldDialogMode: "new",
        moduleId: "module_1",
        parentForm: "parent"
      }
    }));
  });

  it("should render <SettingsTab />", () => {
    expect(component.find(TranslationsTab)).to.have.lengthOf(1);
  });
});
