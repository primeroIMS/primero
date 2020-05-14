import { fromJS } from "immutable";

import toProtectionConcernTable from "./to-protection-concern-table";

describe("toProtectionConcernTable - pages/dashboard/utils/", () => {
  it("should convert the data for DashboardTable", () => {
    const i18nMock = { t: () => ({}), locale: "en" };
    const lookups = [
      {
        id: "sexually_exploited",
        display_text: { en: "Sexually Exploited", fr: "" }
      }
    ];

    const data = fromJS({
      name: "dashboard.dash_protection_concerns",
      type: "indicator",
      indicators: {
        protection_concerns_open_cases: {
          sexually_exploited: {
            count: 1,
            query: [
              "record_state=true",
              "status=open",
              "protection_concerns=sexually_exploited"
            ]
          }
        },
        protection_concerns_new_this_week: {
          sexually_exploited: {
            count: 2,
            query: [
              "record_state=true",
              "status=open",
              "created_at=2020-01-26T00:00:00Z..2020-02-01T23:59:59Z",
              "protection_concerns=sexually_exploited"
            ]
          }
        },
        protection_concerns_all_cases: {
          sexually_exploited: {
            count: 4,
            query: [
              "record_state=true",
              "protection_concerns=sexually_exploited"
            ]
          }
        },
        protection_concerns_closed_this_week: {
          sexually_exploited: {
            count: 1,
            query: [
              "record_state=true",
              "status=closed",
              "date_closure=2020-01-26T00:00:00Z..2020-02-01T23:59:59Z",
              "protection_concerns=sexually_exploited"
            ]
          }
        }
      }
    });

    const expected = {
      columns: [
        { name: "", label: {} },
        { name: "protection_concerns_all_cases", label: {} },
        { name: "protection_concerns_open_cases", label: {} },
        { name: "protection_concerns_new_this_week", label: {} },
        { name: "protection_concerns_closed_this_week", label: {} }
      ],
      data: [
        {
          "": "Sexually Exploited",
          protection_concerns_all_cases: 4,
          protection_concerns_open_cases: 1,
          protection_concerns_new_this_week: 2,
          protection_concerns_closed_this_week: 1
        }
      ],
      query: [
        {
          "": "Sexually Exploited",
          protection_concerns_all_cases: [
            "record_state=true",
            "protection_concerns=sexually_exploited"
          ],
          protection_concerns_open_cases: [
            "record_state=true",
            "status=open",
            "protection_concerns=sexually_exploited"
          ],
          protection_concerns_new_this_week: [
            "record_state=true",
            "status=open",
            "created_at=2020-01-26T00:00:00Z..2020-02-01T23:59:59Z",
            "protection_concerns=sexually_exploited"
          ],
          protection_concerns_closed_this_week: [
            "record_state=true",
            "status=closed",
            "date_closure=2020-01-26T00:00:00Z..2020-02-01T23:59:59Z",
            "protection_concerns=sexually_exploited"
          ]
        }
      ]
    };

    const converted = toProtectionConcernTable(data, i18nMock, lookups);

    expect(converted).to.deep.equal(expected);
  });
});
