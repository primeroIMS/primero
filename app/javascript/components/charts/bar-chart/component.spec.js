// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Map } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { buildGraphData } from "../../report/utils";

import BarChart from "./component";

describe("<BarChart />", () => {
  it("renders canvas with bar chart and description", () => {
    const agencies = [
      {
        id: 1,
        name: "Test agency"
      }
    ];

    const data = Map({
      title: "Cases by Nationality",
      column_name: "Nationality",
      description: "Number of cases broken down by nationality",
      data: {
        Nicaragua: 1,
        Argentina: 2,
        Alemania: 3
      }
    });
    const showDetails = false;
    const description = "Number of cases broken down by nationality";
    const props = {
      ...buildGraphData(data, { t: () => "Total" }, { agencies }),
      description,
      showDetails
    };

    mountedComponent(<BarChart {...props} />);
    expect(screen.getByText("Number of cases broken down by nationality")).toBeInTheDocument();
    expect(screen.getAllByTestId("canva-report-graph")).toHaveLength(1);
  });
});
