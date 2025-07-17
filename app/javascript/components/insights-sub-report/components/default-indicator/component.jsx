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
  incompleteDataLabel,
  indicatorsRows,
  insightMetadata,
  isGrouped,
  lookups,
  lookupValue,
  namespace,
  subColumnItems,
  subReportTitle,
  TableComponent,
  totalText,
  useAgeRows = false,
  value,
  valueKey
}) {
  const i18n = useI18n();
  const isRtl = useMemo(() => i18n.dir === "rtl", [i18n.dir]);
  const indicatorRows = indicatorsRows[valueKey];
  const tableType = insightMetadata.get("table_type");

  return (
    <div className={css.section}>
      <h3 className={css.sectionTitle}>{subReportTitle(valueKey)}</h3>
      {displayGraph && (
        <BarChartGraphic
          data={buildChartValues({
            totalText,
            getLookupValue: lookupValue,
            localizeDate: i18n.localizeDate,
            value,
            valueKey,
            isGrouped,
            groupedBy,
            ageRanges,
            lookupValues: lookups[valueKey],
            indicatorRows,
            incompleteDataLabel
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
          localizeDate: i18n.localizeDate,
          totalText,
          getLookupValue: lookupValue,
          incompleteDataLabel,
          subColumnItems,
          hasTotalColumn
        })}
        values={buildInsightValues[tableType]({
          getLookupValue: lookupValue,
          data: value,
          key: valueKey,
          totalText,
          isGrouped,
          groupedBy,
          ageRanges,
          lookupValues: lookups[valueKey],
          indicatorRows,
          incompleteDataLabel,
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
        indicatorRows={indicatorsRows}
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
  incompleteDataLabel: PropTypes.string,
  indicatorsRows: PropTypes.object,
  insightMetadata: PropTypes.object,
  isGrouped: PropTypes.bool,
  lookups: PropTypes.object,
  lookupValue: PropTypes.func,
  namespace: PropTypes.string,
  subColumnItems: PropTypes.array,
  subReportTitle: PropTypes.func,
  TableComponent: PropTypes.node,
  totalText: PropTypes.string,
  useAgeRows: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueKey: PropTypes.string
};

export default Component;
