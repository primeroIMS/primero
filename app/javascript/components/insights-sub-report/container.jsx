import { useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { fromJS, List, Map } from "immutable";
import { useDispatch } from "react-redux";

import { getLoading, getErrors } from "../index-table/selectors";
import LoadingIndicator from "../loading-indicator";
import { useI18n } from "../i18n";
import { useMemoizedSelector } from "../../libs";
import { clearSelectedReport } from "../reports-form/action-creators";
import TableValues from "../charts/table-values";
import BarChartGraphic from "../charts/bar-chart";
import useOptions from "../form/use-options";
import InsightsFilters from "../insights-filters";

import { buildChartValues, buildInsightColumns, buildInsightValues, getLookupValue } from "./utils";
import { getInsight } from "./selectors";
import namespace from "./namespace";
import { NAME } from "./constants";
import css from "./styles.css";

const Component = () => {
  const { id, subReport, moduleID } = useParams();
  const i18n = useI18n();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSelectedReport());
    };
  }, []);

  const errors = useMemoizedSelector(state => getErrors(state, namespace));
  const loading = useMemoizedSelector(state => getLoading(state, namespace));
  const insight = useMemoizedSelector(state => getInsight(state));

  const insightLookups = insight.getIn(["report_data", subReport, "lookups"], fromJS({})).entrySeq().toArray();

  const lookups = useOptions({ source: insightLookups });

  const emptyMessage = i18n.t("managed_reports.no_data_table");

  const loadingIndicatorProps = {
    overlay: true,
    emptyMessage,
    hasData: !!insight.getIn(["report_data", subReport], false),
    type: namespace,
    loading,
    errors
  };

  const totalText = i18n.t("managed_reports.total");

  const reportData = insight
    .getIn(["report_data", subReport], fromJS({}))
    .filterNot((_value, key) => ["lookups"].includes(key))
    .groupBy(value => (!List.isList(value) ? "single" : "aggregate"));

  const translateId = valueID => i18n.t(`managed_reports.${id}.sub_reports.${valueID}`, { defaultValue: valueID });

  const subReportTitle = key => i18n.t(["managed_reports", id, "sub_reports", key].join("."));

  const lookupValue = (data, key) => getLookupValue(lookups, translateId, data, key);

  const singleInsightsTableData = reportData
    .get("single", fromJS({}))
    .entrySeq()
    .map(([key, value]) => {
      if (Map.isMap(value)) {
        return value.entrySeq().map(([subKey, subValue]) => ({ colspan: 0, row: [subReportTitle(subKey), subValue] }));
      }

      return { colspan: 0, row: [subReportTitle(key), value] };
    })
    .flatten(1)
    .toArray();

  return (
    <>
      <InsightsFilters moduleID={moduleID} id={id} subReport={subReport} />
      <LoadingIndicator {...loadingIndicatorProps}>
        <div className={css.subReportContent}>
          <div className={css.subReportTables}>
            <h2 className={css.description}>{i18n.t(insight.get("description"))}</h2>
            {singleInsightsTableData.length > 0 && (
              <>
                <h3 className={css.sectionTitle}>{subReportTitle("combined")}</h3>
                <TableValues
                  values={singleInsightsTableData}
                  showPlaceholder
                  name={namespace}
                  emptyMessage={emptyMessage}
                />
              </>
            )}
            {reportData
              .get("aggregate", fromJS({}))
              .entrySeq()
              .map(([valueKey, value]) => (
                <div key={valueKey} className={css.section}>
                  <h3 className={css.sectionTitle}>{subReportTitle(valueKey)}</h3>
                  <BarChartGraphic
                    data={buildChartValues({
                      totalText,
                      getLookupValue: lookupValue,
                      localizeDate: i18n.localizeDate,
                      value,
                      valueKey
                    })}
                    showDetails
                  />
                  <TableValues
                    columns={buildInsightColumns(value, i18n.localizeDate)}
                    values={buildInsightValues(lookupValue, value, valueKey)}
                    showPlaceholder
                    name={namespace}
                    emptyMessage={emptyMessage}
                  />
                </div>
              ))}
          </div>
        </div>
      </LoadingIndicator>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Component;
