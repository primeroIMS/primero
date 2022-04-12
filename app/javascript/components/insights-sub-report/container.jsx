import { useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { fromJS } from "immutable";
import { useDispatch } from "react-redux";

import { getLoading, getErrors } from "../index-table/selectors";
import LoadingIndicator from "../loading-indicator";
import { useI18n } from "../i18n";
import { useMemoizedSelector } from "../../libs";
import { clearSelectedReport } from "../reports-form/action-creators";
import BarChartGraphic from "../charts/bar-chart";
import TableValues from "../charts/table-values";
import useOptions from "../form/use-options";

import {
  buildChartValues,
  buildInsightColumns,
  buildSingleInsightsData,
  buildInsightValues,
  getLookupValue
} from "./utils";
import { getInsight, getInsightFilter, getIsGroupedInsight } from "./selectors";
import namespace from "./namespace";
import { NAME, GBV_COMBINED_INDICATORS, GROUPED_BY_FILTER } from "./constants";
import css from "./styles.css";
import { setSubReport } from "./action-creators";

const Component = () => {
  const { id, subReport } = useParams();
  const i18n = useI18n();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSubReport(subReport));

    return () => {
      dispatch(setSubReport(null));
    };
  }, [subReport]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedReport());
    };
  }, []);

  const errors = useMemoizedSelector(state => getErrors(state, namespace));
  const loading = useMemoizedSelector(state => getLoading(state, namespace));
  const insight = useMemoizedSelector(state => getInsight(state));
  const isGrouped = useMemoizedSelector(state => getIsGroupedInsight(state, subReport));
  const groupedBy = useMemoizedSelector(state => getInsightFilter(state, GROUPED_BY_FILTER));

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
    .groupBy((_value, key) => ((GBV_COMBINED_INDICATORS[subReport] || []).includes(key) ? "single" : "aggregate"));

  const translateId = valueID => i18n.t(`managed_reports.${id}.sub_reports.${valueID}`, { defaultValue: valueID });

  const subReportTitle = key => i18n.t(["managed_reports", id, "sub_reports", key].join("."));

  const lookupValue = (data, key) => getLookupValue(lookups, translateId, data, key);

  const singleInsightsTableData = buildSingleInsightsData(reportData, isGrouped).toList();

  return (
    <>
      <LoadingIndicator {...loadingIndicatorProps}>
        <div className={css.subReportContent}>
          <div className={css.subReportTables}>
            <h2 className={css.description}>{i18n.t(insight.get("description"))}</h2>
            {singleInsightsTableData.size > 0 && (
              <>
                <h3 className={css.sectionTitle}>{subReportTitle("combined")}</h3>
                <TableValues
                  columns={buildInsightColumns({
                    value: singleInsightsTableData,
                    isGrouped,
                    groupedBy,
                    localizeDate: i18n.localizeDate
                  })}
                  values={buildInsightValues({
                    getLookupValue: lookupValue,
                    data: singleInsightsTableData,
                    isGrouped,
                    groupedBy
                  })}
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
                      valueKey,
                      isGrouped,
                      groupedBy
                    })}
                    showDetails
                  />
                  <TableValues
                    columns={buildInsightColumns({ value, isGrouped, groupedBy, localizeDate: i18n.localizeDate })}
                    values={buildInsightValues({
                      getLookupValue: lookupValue,
                      data: value,
                      key: valueKey,
                      isGrouped,
                      groupedBy
                    })}
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
