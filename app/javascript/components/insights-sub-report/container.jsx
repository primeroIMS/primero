// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fromJS } from "immutable";
import { useDispatch } from "react-redux";
import isNil from "lodash/isNil";
import isString from "lodash/isString";

import { getPrimaryAgeRanges } from "../application/selectors";
import { getLoading, getErrors } from "../index-table/selectors";
import LoadingIndicator from "../loading-indicator";
import { useI18n } from "../i18n";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import { clearSelectedReport } from "../reports-form/action-creators";
import useOptions from "../form/use-options";
import { OPTION_TYPES } from "../form/constants";
import { REFERRAL_TRANSFERS_SUBREPORTS } from "../../config";

import InsightTableValues from "./components/table-values";
import DefaultIndicator from "./components/default-indicator";
import MultipleViolationsIndicator from "./components/multiple-violations-indicator";
import {
  buildInsightColumns,
  buildSingleInsightsData,
  buildInsightValues,
  buildReportData,
  getLookupValue,
  formatAgeRange,
  getIndicatorSubcolumnKeys
} from "./utils";
import { getInsight, getInsightFilter, getIsGroupedInsight } from "./selectors";
import namespace from "./namespace";
import {
  GROUPED_BY_FILTER,
  NAME,
  GHN_VIOLATIONS_INDICATORS_IDS,
  PERCENTAGE_INDICATORS,
  HEADER_TITLE_KEYS
} from "./constants";
import css from "./styles.css";
import { setSubReport } from "./action-creators";
import getSubcolumnItems from "./utils/get-subcolumn-items";
import hasTotalColumn from "./utils/has-total-column";
import transformIndicatorsRows from "./utils/transform-indicators-rows";

function Component() {
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

  const [prevGroupedBy, setPrevGroupedBy] = useState(null);
  const [prevGroupIdSample, setPrevGroupIdSample] = useState(null);
  const errors = useMemoizedSelector(state => getErrors(state, namespace));
  const loading = useMemoizedSelector(state => getLoading(state, namespace));
  const insight = useMemoizedSelector(state => getInsight(state));
  const isGrouped = useMemoizedSelector(state => getIsGroupedInsight(state, subReport));
  const groupedBy = useMemoizedSelector(state => getInsightFilter(state, GROUPED_BY_FILTER));
  const primaryAgeRanges = useMemoizedSelector(state => getPrimaryAgeRanges(state));

  const insightMetadata = insight.getIn(["report_data", subReport, "metadata"], fromJS({}));
  const insightLookups = insightMetadata.get("lookups", fromJS({})).entrySeq().toArray();
  const displayGraph = insightMetadata.get("display_graph", true);
  const indicatorsRows = insightMetadata.get("indicators_rows", fromJS({}));
  const indicatorsRowsAsOptions = useMemo(
    () => transformIndicatorsRows(indicatorsRows, i18n.locale),
    [indicatorsRows, i18n.locale]
  );
  const headerKeys = HEADER_TITLE_KEYS[insight.get("id")] || {};

  const optionValues = Object.values(OPTION_TYPES);
  const indicatorsSubcolumns = insightMetadata.get("indicators_subcolumns", fromJS({}));
  const indicatorSubcolumnLookups = useMemo(
    () =>
      indicatorsSubcolumns
        .entrySeq()
        .toArray()
        .filter(([, value]) => isString(value) && (value.startsWith("lookup") || optionValues.includes(value))),
    [indicatorsSubcolumns]
  );
  const isReferralsTransferSubreport = REFERRAL_TRANSFERS_SUBREPORTS.includes(subReport);

  const lookups = useOptions({ source: insightLookups });
  const subColumnLookups = useOptions({ source: indicatorSubcolumnLookups });

  const emptyMessage = i18n.t("managed_reports.no_data_table");
  const totalText = i18n.t("managed_reports.total");
  const violationsText = i18n.t("managed_reports.violations_total");
  const tableType = insightMetadata?.get("table_type") || "default";

  const reportData = useMemo(() => buildReportData(insight, subReport), [insight, subReport]);

  const groupIdSample = useMemo(() => {
    const dataGroup = reportData
      .valueSeq()
      .flatMap(value => value.valueSeq())
      .find(elem => elem.find(group => group.get("group_id")));

    return dataGroup?.first()?.get("group_id");
  }, [reportData]);

  const incompleteDataLabel = i18n.t("managed_reports.incomplete_data");

  const translateId = valueID => {
    if (isNil(valueID) || valueID === "incomplete_data") {
      return incompleteDataLabel;
    }

    return i18n.t(`managed_reports.${id}.sub_reports.${valueID}`, { defaultValue: valueID });
  };

  const subReportTitle = key => i18n.t(["managed_reports", id, "sub_reports", key].join("."));

  const lookupValue = (data, key, property) =>
    getLookupValue(lookups, indicatorsRowsAsOptions, translateId, data, key, property, totalText);

  const singleInsightsTableData = buildSingleInsightsData(reportData, isGrouped).toList();

  const ageRanges = (primaryAgeRanges || fromJS([])).reduce((acc, range) => acc.concat(formatAgeRange(range)), []);

  const TableComponent = {
    ghn_report: InsightTableValues,
    default: InsightTableValues
  }[tableType];

  const hasData = !!insight.getIn(["report_data", subReport], false);

  function getIndicator(indicator) {
    if (indicator === "multiple_violations") {
      return MultipleViolationsIndicator;
    }

    return DefaultIndicator;
  }

  useEffect(() => {
    if (prevGroupIdSample !== groupIdSample) {
      setPrevGroupIdSample(groupIdSample);
    }

    if (groupedBy !== prevGroupedBy) {
      setPrevGroupedBy(groupedBy);
    }
  }, [groupIdSample]);

  const currentGroupBy = prevGroupIdSample !== groupIdSample ? groupedBy : prevGroupedBy;

  const cellRender = useCallback((val, index) => (index === 0 ? val : `${val}%`), []);
  const chartRender = useCallback(val => `${val}%`, []);
  const includeZeros = insight.get("include_zeros", false);

  return (
    <div className={css.container}>
      <LoadingIndicator
        overlay
        emptyMessage={emptyMessage}
        hasData={hasData && !loading}
        type={namespace}
        loading={loading}
        errors={errors}
      >
        <div className={css.subReportContent}>
          <h2 className={css.description}>{i18n.t(insight.get("description"))}</h2>
          {singleInsightsTableData.size > 0 && (
            <>
              <h3 className={css.sectionTitle}>{subReportTitle("combined")}</h3>
              <InsightTableValues
                columns={buildInsightColumns[tableType]({
                  value: singleInsightsTableData,
                  isGrouped,
                  groupedBy: currentGroupBy,
                  localizeDate: i18n.localizeDate,
                  totalText,
                  incompleteDataLabel
                })}
                values={buildInsightValues[tableType]({
                  getLookupValue: lookupValue,
                  data: singleInsightsTableData,
                  totalText,
                  isGrouped,
                  groupedBy: currentGroupBy,
                  incompleteDataLabel
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
            .map(([valueKey, value]) => {
              const indicatorIsGrouped = value.some(elem => elem.get("group_id"));
              const indicatorHasTotalColumn = hasTotalColumn(indicatorIsGrouped, value);
              const indicatorSubColumnKeys = getIndicatorSubcolumnKeys(value);
              const Indicator = getIndicator(valueKey);
              const subColumnItems = getSubcolumnItems({
                hasTotalColumn: indicatorHasTotalColumn,
                subColumnLookups,
                valueKey,
                ageRanges,
                indicatorsSubcolumns,
                totalText,
                indicatorSubColumnKeys,
                includeAllSubColumns: !isReferralsTransferSubreport,
                incompleteDataLabel
              });

              const headerTitle = headerKeys[valueKey] ? i18n.t(headerKeys[valueKey]) : null;
              const cellValueRender = PERCENTAGE_INDICATORS.includes(valueKey) ? cellRender : null;
              const chartValueRender = PERCENTAGE_INDICATORS.includes(valueKey) ? chartRender : null;

              return (
                <Indicator
                  key={valueKey}
                  valueKey={valueKey}
                  value={value}
                  includeZeros={includeZeros}
                  ageRanges={ageRanges}
                  displayGraph={displayGraph}
                  emptyMessage={emptyMessage}
                  groupedBy={currentGroupBy}
                  incompleteDataLabel={incompleteDataLabel}
                  insightMetadata={insightMetadata}
                  isGrouped={indicatorIsGrouped}
                  lookups={lookups}
                  indicatorsRows={indicatorsRowsAsOptions}
                  lookupValue={lookupValue}
                  namespace={namespace}
                  headerTitle={headerTitle}
                  subReportTitle={subReportTitle}
                  TableComponent={TableComponent}
                  totalText={GHN_VIOLATIONS_INDICATORS_IDS.includes(valueKey) ? violationsText : totalText}
                  subColumnItems={subColumnItems}
                  hasTotalColumn={indicatorHasTotalColumn}
                  cellValueRender={cellValueRender}
                  chartValueRender={chartValueRender}
                />
              );
            })}
        </div>
      </LoadingIndicator>
    </div>
  );
}

Component.displayName = NAME;

export default Component;
