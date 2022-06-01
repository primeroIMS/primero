import { fromJS, Map } from "immutable";

const getFirstGroup = reportData =>
  reportData
    .valueSeq()
    .flatMap(value => value)
    .first()
    .get("group_id", "")
    .toString();

const buildGroupedInsights = reportData => {
  if (!reportData.size) {
    return fromJS([]);
  }

  const firstGroup = getFirstGroup(reportData);

  return reportData
    .entrySeq()
    .flatMap(([key, value]) => {
      // Create dummy record if there is no data for this indicator
      if (value.isEmpty()) {
        return fromJS([{ group_id: firstGroup, data: [{ id: key, total: 0 }] }]);
      }

      return value.map(elem =>
        fromJS({
          group_id: elem.get("group_id"),
          data: Map.isMap(elem.get("data", fromJS([])))
            ? elem
                .get("data", fromJS([]))
                .entrySeq()
                .map(([subKey, subValue]) => fromJS({ id: subKey, total: subValue }))
            : elem.get("data", fromJS([])).map(dataElem => fromJS({ id: key, total: dataElem.get("total") }))
        })
      );
    })
    .reduce((acc, elem) => {
      const groupIndex = acc.findIndex(group => group.get("group_id") === elem.get("group_id"));

      if (groupIndex >= 0) {
        return acc.updateIn([groupIndex, "data"], data => data.concat(elem.get("data", fromJS([]))));
      }

      return acc.push(elem);
    }, fromJS([]));
};

export default (reportData, isGrouped) => {
  const singleReportData = reportData.get("single", fromJS({}));

  if (!isGrouped) {
    return singleReportData.entrySeq().flatMap(([key, value]) => {
      if (Map.isMap(value)) {
        return value.entrySeq().map(([subKey, subValue]) => fromJS({ id: subKey, total: subValue }));
      }

      return value.map(elem => fromJS({ id: key, total: elem.get("total") }));
    });
  }

  return buildGroupedInsights(singleReportData);
};
