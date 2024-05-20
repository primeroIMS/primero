// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { TableCell, TableRow } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";
import InsightsTableHeaderSubItems from "../insights-table-header-sub-items";

import InsightsTableHeader from "./component";

describe("<InsightsTableHeader />", () => {
  let component;
  const props = {
    addEmptyCell: true,
    columns: [
      {
        label: "2021",
        items: ["Q2", "Q3", "Q4"],
        subItems: ["boys", "girls", "unknown", "total"],
        colspan: 12
      },
      {
        label: "2022",
        items: ["Q1", "Q2"],
        subItems: ["boys", "girls", "unknown", "total"],
        colspan: 8
      }
    ]
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(InsightsTableHeader, props));
  });

  it("should render <InsightsTableHeader /> component", () => {
    expect(component.find(InsightsTableHeader)).to.have.lengthOf(1);
  });

  it("should render <TableRow /> component", () => {
    expect(component.find(TableRow)).to.have.lengthOf(3);
  });

  it("should render <TableCell /> component", () => {
    expect(component.find(TableCell)).to.have.lengthOf(30);
  });

  it("should render <InsightsTableHeaderSubItems /> component", () => {
    expect(component.find(InsightsTableHeaderSubItems)).to.have.lengthOf(1);
  });

  it("should accept valid props for <InsightsTableHeader /> component", () => {
    const insightsTableHeader = { ...component.find(InsightsTableHeader).at(0).props() };

    ["addEmptyCell", "columns"].forEach(property => {
      expect(insightsTableHeader).to.have.property(property);
      delete insightsTableHeader[property];
    });
    expect(insightsTableHeader).to.be.empty;
  });
});
