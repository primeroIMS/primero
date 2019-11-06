import { expect } from "chai";
import { fromJS } from "immutable";
import { TableRow } from "@material-ui/core";

import { buildDataForTable } from "./../../pages/report/helpers";
import { setupMountedThemeComponent } from "./../../../test";

import TableValues from "./component";

describe("<TableValues />", () => {
  it("renders canvas values as table", () => {
    const data = fromJS({
      id: 1,
      name: {
        en: "Registration CP",
        fr: "Registration CP",
        ar: "Registration CP"
      },
      description: {
        en: "Case registrations over time",
        fr: "Case registrations over time",
        ar: "Case registrations over time"
      },
      graph: true,
      graph_type: "bar",
      fields: [
        {
          name: "registration_date",
          display_name: {
            en: "Date of Registration or Interview",
            fr: "",
            ar: ""
          },
          position: {
            type: "horizontal",
            order: 0
          }
        }
      ],
      report_data: {
        "May-2019": {
          _total: 0
        },
        "Jun-2019": {
          _total: 0
        },
        "Jul-2019": {
          _total: 0
        },
        "Aug-2019": {
          _total: 1
        },
        "Sep-2019": {
          _total: 1
        }
      }
    });

    const component = setupMountedThemeComponent(TableValues, {
      ...buildDataForTable(data, { t: () => "Total" })
    });

    expect(component.find(TableRow).length).to.equal(6);
  });
});
