// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../../../../test";

import SubformFieldList from "./component";

describe("<SubformFieldList />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMockFormComponent(SubformFieldList, {
      props: { formContextFields: {}, subformField: fromJS({}) }
    }));
  });

  it("should render <SettingsTab />", () => {
    expect(component.find(SubformFieldList)).to.have.lengthOf(1);
  });
});
