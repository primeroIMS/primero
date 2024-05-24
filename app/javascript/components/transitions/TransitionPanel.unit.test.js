// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { setupMountedComponent } from "../../test";

import TransitionPanel from "./TransitionPanel";

describe("<TransitionPanel />", () => {
  let component;
  const props = {
    children: <p>This is a children</p>
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(TransitionPanel, props));
  });

  it("renders a <p> as children of  TransitionPanel", () => {
    const cpTransitionPanel = component.find(TransitionPanel);

    expect(cpTransitionPanel.find("p").props().children).to.equal("This is a children");
  });
});
