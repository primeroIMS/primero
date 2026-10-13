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
          _total: 0,
          query: ["module_id=primeromodule-cp"]
        },
        "Jun-2019": {
          _total: 0,
          query: ["module_id=primeromodule-cp"]
        },
        "Jul-2019": {
          _total: 0,
          query: ["module_id=primeromodule-cp"]
        },
        "Aug-2019": {
          _total: 1,
          query: ["module_id=primeromodule-cp"]
        },
        "Sep-2019": {
          _total: 1,
          query: ["module_id=primeromodule-cp"]
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

    mountedComponent(<TableValues {...props} />);
    expect(screen.getAllByRole("table")).toHaveLength(1);
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getAllByRole("button")).toHaveLength(5);
  });

  it("renders the values of a nested record type report without click-throughs", () => {
    const data = fromJS({
      id: 2,
      name: { en: "Services" },
      graph: false,
      record_type: "reportable_service",
      fields: [
        {
          name: "service_response_type",
          display_name: { en: "Type of Response" },
          position: { type: "horizontal", order: 0 },
          option_labels: { en: [{ id: "service_provision", display_text: "Service provision" }] }
        },
        {
          name: "service_type",
          display_name: { en: "Type of Service" },
          position: { type: "vertical", order: 0 },
          option_labels: { en: [{ id: "health", display_text: "Health" }] }
        }
      ],
      report_data: { service_provision: { _total: 2, health: { _total: 2 } } }
    });

    mountedComponent(<TableValues {...buildTableData(data, window.I18n, {})} recordType="reportable_service" />);

    expect(screen.getAllByRole("table")).toHaveLength(1);
    expect(screen.getByText("Service provision")).toBeInTheDocument();
    expect(screen.getByText("Health")).toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
