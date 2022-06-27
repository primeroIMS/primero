import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import css from "../../styles.css";
import { buildChartValues, buildInsightColumns, buildInsightValues } from "../../utils";
import BarChartGraphic from "../../../charts/bar-chart";

function Component({
  ageRanges,
  displayGraph,
  emptyMessage,
  groupedBy,
  incompleteDataLabel,
  insightMetadata,
  isGrouped,
  lookups,
  lookupValue,
  namespace,
  subReportTitle,
  TableComponent,
  totalText,
  value,
  valueKey
}) {
  const i18n = useI18n();

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
          showDetails
          hideLegend
        />
      )}
      <TableComponent
        useInsightsHeader
        columns={buildInsightColumns[insightMetadata.get("table_type")]({
          value,
          isGrouped,
          groupedBy,
          localizeDate: i18n.localizeDate,
          totalText,
          getLookupValue: lookupValue,
          incompleteDataLabel
        })}
        values={buildInsightValues[insightMetadata.get("table_type")]({
          getLookupValue: lookupValue,
          data: value,
          key: valueKey,
          isGrouped,
          groupedBy,
          ageRanges,
          lookupValues: lookups[valueKey],
          incompleteDataLabel
        })}
        showPlaceholder
        name={namespace}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}

Component.displayName = "DefaultIndicator";

Component.propTypes = {
  ageRanges: PropTypes.array,
  displayGraph: PropTypes.bool,
  emptyMessage: PropTypes.string,
  groupedBy: PropTypes.string,
  incompleteDataLabel: PropTypes.string,
  insightMetadata: PropTypes.object,
  isGrouped: PropTypes.bool,
  lookups: PropTypes.object,
  lookupValue: PropTypes.func,
  namespace: PropTypes.string,
  subReportTitle: PropTypes.func,
  TableComponent: PropTypes.node,
  totalText: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueKey: PropTypes.string
};

export default Component;
