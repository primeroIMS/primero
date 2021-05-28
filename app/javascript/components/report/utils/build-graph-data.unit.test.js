import { fromJS } from "immutable";

import buildGraphData from "./build-graph-data";

describe("<Report /> - utils", () => {
  describe("buildGraphData", () => {
    it("should convert data to string", () => {
      const report = fromJS({
        editable: false,
        record_type: "case",
        name: {
          en: "Cases by Agency CP"
        },
        graph_type: "bar",
        graph: true,
        module_id: ["primeromodule-cp"],
        group_dates_by: "date",
        group_ages: false,
        report_data: {
          agency1: {
            _total: 1
          },
          agency2: {
            _total: 43
          }
        },
        fields: [
          {
            name: "owned_by_agency_id",
            display_name: {
              en: "Case Manager's Agency"
            },
            position: {
              type: "horizontal",
              order: 0
            },
            option_strings_source: "Agency"
          }
        ],
        id: 148,
        filters: [
          {
            value: ["open"],
            attribute: "status"
          },
          {
            value: ["true"],
            attribute: "record_state"
          },
          {
            attribute: "owned_by_groups",
            value: ["usergroup-primero-cp"]
          }
        ],
        disabled: false,
        description: {
          en: "Number of cases broken down by agency"
        }
      });
      const i18n = {
        t: x => x,
        locale: "en"
      };
      const agencies = [
        {
          id: "agency1",
          display_text: "agency1"
        },
        {
          id: "agency2",
          display_text: "agency2"
        }
      ];
      const expected = {
        description: "Number of cases broken down by agency",
        data: {
          labels: ["agency1", "agency2"],
          datasets: [
            {
              backgroundColor: "#e0dfd6",
              data: [1, 43],
              label: "report.total"
            }
          ]
        }
      };

      expect(buildGraphData(report, i18n, { agencies })).to.deep.equal(expected);
    });
  });
});
