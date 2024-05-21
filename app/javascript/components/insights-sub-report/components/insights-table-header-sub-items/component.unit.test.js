// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { TableCell, TableRow } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";

import InsightsTableHeaderSubItems from "./component";

describe("<InsightsTableHeaderSubItems />", () => {
  let component;
  const props = {
    addEmptyCell: true,
    groupedSubItemcolumns: {
      "2021-Q2": ["boys", "girls", "unknown", "total"],
      "2021-Q3": ["boys", "girls", "unknown", "total"],
      "2021-Q4": ["boys", "girls", "unknown", "total"]
    }
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(InsightsTableHeaderSubItems, props));
  });

  it("should render <InsightsTableHeader /> component", () => {
    expect(component.find(InsightsTableHeaderSubItems)).to.have.lengthOf(1);
  });

  it("should render <TableRow /> component", () => {
    expect(component.find(TableRow)).to.have.lengthOf(1);
  });

  it("should render <TableCell /> component", () => {
    expect(component.find(TableCell)).to.have.lengthOf(13);
  });

  it("should accept valid props for <InsightsTableHeader /> component", () => {
    const insightsTableHeaderSubItems = { ...component.find(InsightsTableHeaderSubItems).at(0).props() };

    ["addEmptyCell", "groupedSubItemcolumns"].forEach(property => {
      expect(insightsTableHeaderSubItems).to.have.property(property);
      delete insightsTableHeaderSubItems[property];
    });
    expect(insightsTableHeaderSubItems).to.be.empty;
  });
});
