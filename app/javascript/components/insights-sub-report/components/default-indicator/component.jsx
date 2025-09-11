// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useMemo } from "react";

import { useI18n } from "../../../i18n";
import css from "../../styles.css";
import { buildChartValues, buildInsightColumns, buildInsightValues } from "../../utils";
import BarChartGraphic from "../../../charts/bar-chart";

function Component({
  ageRanges,
  displayGraph,
  cellValueRender,
  chartValueRender,
  emptyMessage,
  groupedBy,
  hasTotalColumn,
  headerTitle,
  includeZeros,
  insightMetadata,
  isGrouped,
  labels,
  lookupValue,
  namespace,
  subColumnItems,
  subReportTitle,
  TableComponent,
  useAgeRows = false,
  value,
  indicatorKey,
  indicatorRows,
  indicatorLookups
}) {
  const i18n = useI18n();
  const isRtl = useMemo(() => i18n.dir === "rtl", [i18n.dir]);
  const tableType = insightMetadata.get("table_type");

  return (
    <div className={css.section}>
      <h3 className={css.sectionTitle}>{subReportTitle}</h3>
      {displayGraph && (
        <BarChartGraphic
          data={buildChartValues({
            getLookupValue: lookupValue,
            localizeDate: i18n.localizeDate,
            value,
            valueKey: indicatorKey,
            isGrouped,
            groupedBy,
            ageRanges,
            lookupValues: indicatorLookups,
            indicatorRows,
            labels
          })}
          valueRender={chartValueRender}
          showDetails
          hideLegend
          reverse={isRtl}
        />
      )}
      <TableComponent
        useInsightsHeader
        valueRender={cellValueRender}
        headerTitle={headerTitle}
        columns={buildInsightColumns[tableType]({
          value,
          isGrouped,
          groupedBy,
          labels,
          localizeDate: i18n.localizeDate,
          getLookupValue: lookupValue,
          subColumnItems,
          hasTotalColumn
        })}
        values={buildInsightValues[tableType]({
          getLookupValue: lookupValue,
          data: value,
          key: indicatorKey,
          labels,
          isGrouped,
          groupedBy,
          ageRanges,
          lookupValues: indicatorLookups,
          indicatorRows,
          subColumnItems,
          hasTotalColumn,
          includeZeros
        })}
        useAgeRows={useAgeRows}
        showPlaceholder
        name={namespace}
        emptyMessage={emptyMessage}
        subColumnItemsSize={subColumnItems?.length}
        withTotals={hasTotalColumn}
      />
    </div>
  );
}

Component.displayName = "DefaultIndicator";

Component.propTypes = {
  ageRanges: PropTypes.array,
  cellValueRender: PropTypes.func,
  chartValueRender: PropTypes.func,
  displayGraph: PropTypes.bool,
  emptyMessage: PropTypes.string,
  groupedBy: PropTypes.string,
  hasTotalColumn: PropTypes.bool,
  headerTitle: PropTypes.string,
  includeZeros: PropTypes.bool,
  indicatorKey: PropTypes.string,
  indicatorLookups: PropTypes.object,
  indicatorRows: PropTypes.object,
  insightMetadata: PropTypes.object,
  isGrouped: PropTypes.bool,
  labels: PropTypes.object,
  lookupValue: PropTypes.func,
  namespace: PropTypes.string,
  subColumnItems: PropTypes.array,
  subReportTitle: PropTypes.string,
  TableComponent: PropTypes.node,
  useAgeRows: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Component;
