import { Map } from "immutable";

import { buildGraphData } from "../../report/utils";
import { setupMountedThemeComponent } from "../../../test";

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
    const component = setupMountedThemeComponent(BarChart, {
      ...buildGraphData(data, { t: () => "Total" }, { agencies }),
      description,
      showDetails
    });

    expect(component.find("p").props().children).to.equal("Number of cases broken down by nationality");
    expect(component.find("canvas")).to.have.lengthOf(1);
  });
});
