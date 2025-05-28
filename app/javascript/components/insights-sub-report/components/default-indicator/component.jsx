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
  value,
  valueKey
}) {
  const i18n = useI18n();
  const isRtl = useMemo(() => i18n.dir === "rtl", [i18n.dir]);

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
        columns={buildInsightColumns[insightMetadata.get("table_type")]({
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
        values={buildInsightValues[insightMetadata.get("table_type")]({
          getLookupValue: lookupValue,
          data: value,
          key: valueKey,
          totalText,
          isGrouped,
          groupedBy,
          ageRanges,
          lookupValues: lookups[valueKey],
          indicatorRows: indicatorsRows[valueKey],
          incompleteDataLabel,
          subColumnItems,
          hasTotalColumn
        })}
        showPlaceholder
        name={namespace}
        emptyMessage={emptyMessage}
        subColumnItemsSize={subColumnItems?.length}
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueKey: PropTypes.string
};

export default Component;
