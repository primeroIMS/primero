import { Map } from "immutable";

import { buildDataForGraph } from "../../report/utils";
import { setupMountedThemeComponent } from "../../../test";

import BarChart from "./component";

describe("<BarChart />", () => {
  it("renders canvas with bar chart and description", () => {
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
      ...buildDataForGraph(data),
      description,
      showDetails
    });

    expect(component.find("p").props().children).to.equal(
      "Number of cases broken down by nationality"
    );
    expect(component.find("canvas")).to.have.lengthOf(1);
  });
});
