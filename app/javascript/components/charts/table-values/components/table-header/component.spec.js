import { mountedComponent, screen } from "test-utils";

import TableHeader from "./component";

describe("<TableValues />/components/<TableHeader/ >", () => {
  it("should render the correct number of headers", () => {
    const props = {
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
    };

    mountedComponent(<TableHeader />, props);
    expect(screen.getAllByRole("tableRow")).toHaveLength(1);
    expect(screen.getAllByRole("tableCell")).toHaveLength(2);
  });
});
