import "test/test.setup";
import { setupMountedThemeComponent } from "test";
import { expect } from "chai";
import { buildDataForTable } from "components/pages/reports/helpers";
import { Map } from "immutable";
import TableValues from "./component";

describe("<TableValues />", () => {
  it("renders canvas values as table", () => {

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
    const component = setupMountedThemeComponent(TableValues, { ...buildDataForTable(data) });
    expect(component.find("table tr").length).to.equal(4);
  });
});
