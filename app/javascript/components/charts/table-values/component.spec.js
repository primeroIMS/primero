// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { buildTableData } from "../../report/utils";
import { abbrMonthNames } from "../../../test-utils";

import TableValues from "./component";

describe("<TableValues />", () => {
  beforeEach(() => {
    jest.spyOn(window.I18n, "t").mockImplementation(arg => {
      if (arg === "date.abbr_month_namesf") return abbrMonthNames;
      if (arg === "report.total") return "Total";

      return arg;
    });
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

    const props = {
      ...buildTableData(data, window.I18n, { agencies })
    };

    mountedComponent(<TableValues />, props);
    expect(screen.getAllByRole("table")).toHaveLength(1);
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
