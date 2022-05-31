import { useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { fromJS } from "immutable";
import { useDispatch } from "react-redux";

import { getAgeRanges } from "../application/selectors";
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
  getLookupValue,
  formatAgeRange
} from "./utils";
import { getInsight, getInsightFilter, getIsGroupedInsight } from "./selectors";
import namespace from "./namespace";
import { COMBINED_INDICATORS, GROUPED_BY_FILTER, NAME } from "./constants";
import css from "./styles.css";
import { setSubReport } from "./action-creators";

const Component = () => {
  const { id, subReport } = useParams();
  const i18n = useI18n();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSubReport(subReport));
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
  const primeroAgeRanges = useMemoizedSelector(state => getAgeRanges(state));

  const insightMetadata = insight.getIn(["report_data", subReport, "metadata"], fromJS({}));
  const insightLookups = insightMetadata.get("lookups", fromJS({})).entrySeq().toArray();
  const displayGraph = insightMetadata.get("display_graph", true);

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
    .getIn(["report_data", subReport, "data"], fromJS({}))
    .groupBy((_value, key) => ((COMBINED_INDICATORS[subReport] || []).includes(key) ? "single" : "aggregate"));

  const translateId = valueID => i18n.t(`managed_reports.${id}.sub_reports.${valueID}`, { defaultValue: valueID });

  const subReportTitle = key => i18n.t(["managed_reports", id, "sub_reports", key].join("."));

  const lookupValue = (data, key, property) => getLookupValue(lookups, translateId, data, key, property);

  const singleInsightsTableData = buildSingleInsightsData(reportData, isGrouped).toList();

  const ageRanges = (primeroAgeRanges || fromJS([])).reduce((acc, range) => acc.concat(formatAgeRange(range)), []);

  const TableComponent = {
    ghn_report: TableValues,
    default: TableValues
  }[insightMetadata.get("table_type")];

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
                  useInsightsHeader
                  columns={buildInsightColumns({
                    value: singleInsightsTableData,
                    isGrouped,
                    groupedBy,
                    localizeDate: i18n.localizeDate,
                    totalText
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
                        lookupValues: lookups[valueKey]
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
                      getLookupValue: lookupValue
                    })}
                    values={buildInsightValues[insightMetadata.get("table_type")]({
                      getLookupValue: lookupValue,
                      data: value,
                      key: valueKey,
                      isGrouped,
                      groupedBy,
                      ageRanges,
                      lookupValues: lookups[valueKey]
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
