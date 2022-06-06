import { Map } from "immutable";

import { COMBINED_INDICATORS } from "../constants";

export default (insight, subReport) => {
  if (!insight.size) {
    return insight;
  }

  const insightOrder = insight.getIn(["report_data", subReport, "metadata", "order"], Map({}));

  const insightData = insight.getIn(["report_data", subReport, "data"], Map({}));

  const sortedData = insightOrder.reduce((acc, order) => {
    return acc.set(order, insightData.get(order));
  }, Map({}));

  return sortedData.groupBy((_value, key) =>
    (COMBINED_INDICATORS[subReport] || []).includes(key) ? "single" : "aggregate"
  );
};
