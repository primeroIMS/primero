import { fromJS } from "immutable";

import toOptionsOverviewBox from "./to-options-overview-box";

describe("pages/dashboard/utils/to-options-overview-box", () => {
  const data = fromJS({
    name: "dashboard.dash_cases_by_incident_type",
    indicators: {
      cases_by_incident_type: {
        physical: { count: 2, query: ["status=open", "incident_types=physical"] },
        unknown_type: { count: 1, query: ["status=open", "incident_types=unknown_type"] }
      }
    }
  });

  const options = [
    { id: "neglect", display_text: "Neglect" },
    { id: "physical", display_text: "Physical violence" }
  ];

  it("returns a row for each option in the order of the options", () => {
    const { items, displayOrder } = toOptionsOverviewBox(data, "cases_by_incident_type", options);

    expect(displayOrder).toEqual(["neglect", "physical"]);
    expect(items.getIn(["indicators", "physical"]).toJS()).toEqual({
      count: 2,
      query: ["status=open", "incident_types=physical"]
    });
  });

  it("returns a zero count without a query for options without cases", () => {
    const { items } = toOptionsOverviewBox(data, "cases_by_incident_type", options);

    expect(items.getIn(["indicators", "neglect"]).toJS()).toEqual({ count: 0, query: [] });
  });

  it("ignores values that are not options", () => {
    const { items } = toOptionsOverviewBox(data, "cases_by_incident_type", options);

    expect(items.getIn(["indicators", "unknown_type"])).toBeUndefined();
  });

  it("returns the option labels by id", () => {
    const { labels } = toOptionsOverviewBox(data, "cases_by_incident_type", options);

    expect(labels).toEqual({ neglect: "Neglect", physical: "Physical violence" });
  });

  it("returns no rows when there are no options", () => {
    const { items, displayOrder } = toOptionsOverviewBox(data, "cases_by_incident_type", []);

    expect(items.get("indicators").size).toBe(0);
    expect(displayOrder).toEqual([]);
  });
});
