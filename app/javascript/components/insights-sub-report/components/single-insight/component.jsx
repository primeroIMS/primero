// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import namespace from "../../namespace";
import { useMemoizedSelector } from "../../../../libs";
import { GROUPED_BY_FILTER } from "../../constants";
import { getInsightFilter, getIsGroupedInsight } from "../../selectors";
import InsightTableValues from "../table-values";
import css from "../../styles.css";
import { buildInsightColumns, buildInsightValues, buildSingleInsightsData } from "../../utils";
import { useI18n } from "../../../i18n";

function Component({ data, labels, lookupValue, subReport, subReportTitle, tableType }) {
  const i18n = useI18n();
  const isGrouped = useMemoizedSelector(state => getIsGroupedInsight(state, subReport));
  const groupedBy = useMemoizedSelector(state => getInsightFilter(state, GROUPED_BY_FILTER));

  const singleInsightsTableData = buildSingleInsightsData(data, isGrouped).toList();

  return (
    <>
      <h3 className={css.sectionTitle}>{subReportTitle}</h3>
      <InsightTableValues
        columns={buildInsightColumns[tableType]({
          value: singleInsightsTableData,
          isGrouped,
          groupedBy,
          localizeDate: i18n.localizeDate,
          labels
        })}
        values={buildInsightValues[tableType]({
          getLookupValue: lookupValue,
          data: singleInsightsTableData,
          isGrouped,
          groupedBy,
          labels
        })}
        showPlaceholder
        name={namespace}
        emptyMessage={labels.empty}
      />
    </>
  );
}

Component.displayName = "SingleInsight";

Component.propTypes = {
  data: PropTypes.object,
  labels: PropTypes.object,
  lookupValue: PropTypes.func,
  subReport: PropTypes.string,
  subReportTitle: PropTypes.string,
  tableType: PropTypes.string
};

export default Component;
