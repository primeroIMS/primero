// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { setupMountedComponent } from "../../../../../../../test";

import ListItemTextSecondary from "./component";

describe("<RecordForm>/form/subforms/<SubformHeader/>/components/<ListItemTextSecondary />", () => {
  it("should render component", () => {
    const props = {
      associatedViolations: {
        killing: [1],
        maiming: [2, 3],
        denials: [5, 6, 7]
      },
      violationsIDs: [1, 3],
      renderSecondaryText: true
    };

    const { component } = setupMountedComponent(ListItemTextSecondary, props);

    expect(component.find(ListItemTextSecondary)).lengthOf(1);
    expect(component.find(ListItemTextSecondary).find("h4")).lengthOf(1);
    expect(component.find(ListItemTextSecondary).find("div")).lengthOf(5);
  });
});
