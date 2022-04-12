import { fromJS } from "immutable";
import { format } from "date-fns";

import buildInsightColumns from "./build-insight-columns";

describe("<InsightsSubReport />/utils/buildInsightColumns", () => {
  context("when is not grouped", () => {
    it("returns an empty array", () => {
      const columns = buildInsightColumns({
        value: fromJS([
          { id: "option_1", total: 5 },
          { id: "option_2", total: 10 }
        ])
      });

      expect(columns).to.deep.equals([]);
    });
  });

  context("when is grouped by year", () => {
    it("returns a single object with items", () => {
      const columns = buildInsightColumns({
        groupedBy: "year",
        isGrouped: true,
        localizeDate: (_key, value) => value,
        value: fromJS([
          {
            group_id: 2022,
            data: [
              { id: "option_1", total: 1 },
              { id: "option_2", total: 2 }
            ]
          },
          {
            group_id: 2023,
            data: [
              { id: "option_1", total: 3 },
              { id: "option_2", total: 1 }
            ]
          },
          {
            group_id: 2024,
            data: [
              { id: "option_2", total: 2 },
              { id: "option_3", total: 8 }
            ]
          }
        ])
      });

      expect(columns).to.deep.equal([{ items: ["2022", "2023", "2024"], colspan: 1 }]);
    });
  });

  context("when is grouped by month", () => {
    it("returns a dataset for each group", () => {
      const columns = buildInsightColumns({
        groupedBy: "month",
        isGrouped: true,
        localizeDate: format,
        value: fromJS([
          {
            group_id: "january-2022",
            data: [
              { id: "option_1", total: 1 },
              { id: "option_2", total: 2 }
            ]
          },
          {
            group_id: "february-2023",
            data: [
              { id: "option_1", total: 3 },
              { id: "option_2", total: 1 }
            ]
          },
          {
            group_id: "january-2024",
            data: [
              { id: "option_2", total: 2 },
              { id: "option_3", total: 8 }
            ]
          }
        ])
      });

      expect(columns).to.deep.equal([
        { items: ["2022", "2023", "2024"], colspan: 2 },
        { items: ["Jan", "Feb"], addEmptyCell: false }
      ]);
    });
  });
});
