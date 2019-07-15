import "test/test.setup";
import { setupMountedThemeComponent } from "test";
import { expect } from "chai";
import { buildDataForReport } from "../../pages/reports/helpers";
import { Map } from "immutable";
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
    const component = setupMountedThemeComponent(BarChart, { ...buildDataForReport(data) });

    expect(component.find("p").props().children).to.equal("Number of cases broken down by nationality");
    expect(component.find("canvas").length).to.equal(1);
  });
});
