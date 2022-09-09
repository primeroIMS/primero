import { fromJS, List } from "immutable";

import { buildComponentColumns } from "./utils";

describe("<IndexTable> - utils", () => {
  describe("buildComponentColumns", () => {
    it("generates a sorted column with all its options", () => {
      const customBodyRender = () => {};

      const columns = buildComponentColumns(
        List([
          { label: "Column 1", name: "column1" },
          { label: "Column 2", name: "column2" },
          { label: "Column 3", name: "column3", options: { customBodyRender } }
        ]),
        "asc",
        "column3"
      );

      expect(columns.map(column => column.name)).to.deep.equals(fromJS(["column1", "column2", "column3"]));
      expect(columns.find(column => column.name === "column3").options).to.deep.equals({
        customBodyRender,
        sortOrder: "asc"
      });
    });
  });
});
