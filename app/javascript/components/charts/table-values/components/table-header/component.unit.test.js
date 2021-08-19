import { TableCell, TableRow } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../test";

import TableHeader from "./component";

describe("<TableValues />/components/<TableHeader/ >", () => {
  it("should render the correct number of headers", () => {
    const { component } = setupMountedComponent(TableHeader, {
      columns: [
        {
          items: ["Category 1", "report.total"],
          colspan: 2
        },
        {
          items: ["6 - 11", "report.total"],
          colspan: 0
        }
      ]
    });

    const headerCells = component.find(TableRow).at(0).find(TableCell);
    const subHeaderCells = component.find(TableRow).at(1).find(TableCell);

    expect(headerCells.at(1).props().colSpan).to.equal(2);
    expect(headerCells).to.have.lengthOf(3);

    expect(subHeaderCells).to.have.lengthOf(4);
  });
});
