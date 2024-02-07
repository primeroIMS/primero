// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { setupMountedComponent } from "../../test";

import ButtonText from "./component";

describe("<ButtonText />", () => {
  let component;
  const props = {
    text: "Test Title"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(ButtonText, props, {}));
  });

  it("should render text", () => {
    expect(component.text()).to.be.equals("Test Title");
  });
});
