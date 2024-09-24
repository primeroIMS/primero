// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "../../../test-utils";

import PieChart from "./component";

describe("<PieChart />", () => {
  const props = {
    data: [10, 12, 8],
    labels: ["Care plan", "New", "Service provision"],
    query: [["workflow=care_plan"], ["workflow=new"], ["workflow=service_provision"]]
  };

  beforeEach(() => {
    mountedComponent(<PieChart {...props} />);
  });

  it("renders a PieChart />", () => {
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });
});
