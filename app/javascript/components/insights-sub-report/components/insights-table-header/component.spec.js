// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "../../../../test-utils";

import InsightsTableHeader from "./component";

describe("<InsightsTableHeader />", () => {
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
    mountedComponent(<InsightsTableHeader {...props} />);
  });

  it("should render table row component", () => {
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("should render row cells component", () => {
    expect(screen.getAllByRole("cell")).toHaveLength(30);
  });
});
