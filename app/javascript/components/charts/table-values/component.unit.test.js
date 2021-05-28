import { fromJS } from "immutable";
import { TableRow } from "@material-ui/core";

import { buildTableData } from "../../report/utils";
import { abbrMonthNames, setupMountedComponent, stub } from "../../../test";

import TableValues from "./component";

describe("<TableValues />", () => {
  let stubI18n = null;

  beforeEach(() => {
    stubI18n = stub(window.I18n, "t")
      .withArgs("date.abbr_month_names")
      .returns(abbrMonthNames)
      .withArgs("report.total")
      .returns("Total");
  });

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

    const agencies = [
      {
        id: 1,
        name: "Test agency"
      }
    ];

    const { component } = setupMountedComponent(TableValues, {
      ...buildTableData(data, window.I18n, { agencies })
    });

    expect(component.find(TableRow)).to.have.lengthOf(6);
  });

  afterEach(() => {
    if (stubI18n) {
      window.I18n.t.restore();
    }
  });
});
