import MUIDataTable from "mui-datatables";

import { setupMountedComponent } from "../../../test";

import DashboardTable from "./component";

describe("<DashboardTable />", () => {
  let component;
  const props = {
    columns: [],
    data: [],
    query: []
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(DashboardTable, props, {}));
  });

  it("renders a MUIDataTable />", () => {
    expect(component.find(MUIDataTable)).to.have.lengthOf(1);
  });

  it("renders a MUIDataTable with valid Props", () => {
    const muiDataTableProps = { ...component.find(MUIDataTable).props() };

    ["columns", "options", "data"].forEach(property => {
      expect(muiDataTableProps).to.have.property(property);
      delete muiDataTableProps[property];
    });

    expect(muiDataTableProps).to.be.empty;
  });
});
