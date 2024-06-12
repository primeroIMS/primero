// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "../../../../test-utils";

import InsightsTableHeaderSubItems from "./component";

describe("<InsightsTableHeaderSubItems />", () => {
  const props = {
    addEmptyCell: true,
    groupedSubItemcolumns: {
      "2021-Q2": ["boys", "girls", "unknown", "total"],
      "2021-Q3": ["boys", "girls", "unknown", "total"],
      "2021-Q4": ["boys", "girls", "unknown", "total"]
    }
  };

  beforeEach(() => {
    mountedComponent(<InsightsTableHeaderSubItems {...props} />);
  });

  it("should render <TableRow /> component", () => {
    expect(screen.getAllByRole("row")).toHaveLength(1);
  });

  it("should render <TableCell /> component", () => {
    expect(screen.getAllByRole("cell")).toHaveLength(13);
  });
});
