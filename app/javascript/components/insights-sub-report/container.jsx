import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { fromJS } from "immutable";
import { useDispatch } from "react-redux";
import isNil from "lodash/isNil";
import isString from "lodash/isString";

import { getAgeRanges } from "../application/selectors";
import { getLoading, getErrors } from "../index-table/selectors";
import LoadingIndicator from "../loading-indicator";
import { useI18n } from "../i18n";
import { useMemoizedSelector } from "../../libs";
import { clearSelectedReport } from "../reports-form/action-creators";
import TableValues from "../charts/table-values";
import useOptions from "../form/use-options";
import transformOptions from "../form/utils/transform-options";

import DefaultIndicator from "./components/default-indicator";
import MultipleViolationsIndicator from "./components/multiple-violations-indicator";
import {
  buildInsightColumns,
  buildSingleInsightsData,
  buildInsightValues,
  buildReportData,
  getLookupValue,
  formatAgeRange
} from "./utils";
import { getInsight, getInsightFilter, getIsGroupedInsight } from "./selectors";
import namespace from "./namespace";
import { GROUPED_BY_FILTER, NAME, GHN_VIOLATIONS_INDICATORS_IDS } from "./constants";
import css from "./styles.css";
import { setSubReport } from "./action-creators";
import getSubcolumnItems from "./utils/get-subcolumn-items";

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
  const indicatorsRows = insightMetadata.get("indicators_rows", fromJS({}));
  const indicatorsRowsAsOptions = useMemo(() => {
    return indicatorsRows
      .entrySeq()
      .reduce((acc, [key, elems]) => ({ ...acc, [key]: transformOptions(elems, i18n.locale) }), {});
  }, [indicatorsRows, i18n.locale]);

  const indicatorsSubcolumns = insightMetadata.get("indicators_subcolumns", fromJS({}));
  const indicatorSubcolumnLookups = useMemo(
    () =>
      indicatorsSubcolumns
        .entrySeq()
        .toArray()
        .filter(([, value]) => isString(value) && value.startsWith("lookup")),
    [indicatorsSubcolumns]
  );

  const lookups = useOptions({ source: insightLookups });
  const subColumnLookups = useOptions({ source: indicatorSubcolumnLookups });

  const emptyMessage = i18n.t("managed_reports.no_data_table");
  const totalText = i18n.t("managed_reports.total");
  const violationsText = i18n.t("managed_reports.violations_total");

  const reportData = buildReportData(insight, subReport);

  const incompleteDataLabel = i18n.t("managed_reports.incomplete_data");

  const translateId = valueID => {
    if (isNil(valueID)) {
      return incompleteDataLabel;
    }

    return i18n.t(`managed_reports.${id}.sub_reports.${valueID}`, { defaultValue: valueID });
  };

  const subReportTitle = key => i18n.t(["managed_reports", id, "sub_reports", key].join("."));

  const lookupValue = (data, key, property) =>
    getLookupValue(lookups, indicatorsRowsAsOptions, translateId, data, key, property, totalText);

  const singleInsightsTableData = buildSingleInsightsData(reportData, isGrouped).toList();

  const ageRanges = (primeroAgeRanges || fromJS([])).reduce((acc, range) => acc.concat(formatAgeRange(range)), []);

  const TableComponent = {
    ghn_report: TableValues,
    default: TableValues
  }[insightMetadata.get("table_type")];

  const hasData = !!insight.getIn(["report_data", subReport], false);

  function getIndicator(indicator) {
    if (indicator === "multiple_violations") {
      return MultipleViolationsIndicator;
    }

    return DefaultIndicator;
  }

  return (
    <div className={css.container}>
      <LoadingIndicator
        overlay
        emptyMessage={emptyMessage}
        hasData={hasData}
        type={namespace}
        loading={loading}
        errors={errors}
      >
        <div className={css.subReportContent}>
          <div>
            <h2 className={css.description}>{i18n.t(insight.get("description"))}</h2>
            {singleInsightsTableData.size > 0 && (
              <>
                <h3 className={css.sectionTitle}>{subReportTitle("combined")}</h3>
                <TableValues
                  useInsightsHeader
                  columns={buildInsightColumns[insightMetadata.get("table_type")]({
                    value: singleInsightsTableData,
                    isGrouped,
                    groupedBy,
                    localizeDate: i18n.localizeDate,
                    totalText,
                    incompleteDataLabel
                  })}
                  values={buildInsightValues[insightMetadata.get("table_type")]({
                    getLookupValue: lookupValue,
                    data: singleInsightsTableData,
                    totalText,
                    isGrouped,
                    groupedBy,
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
                const hasTotalColumn = value.some(elem =>
                  elem.get("data", fromJS([])).some(row => !isNil(row.get("total")))
                );

                const Indicator = getIndicator(valueKey);
                const subColumnItems = getSubcolumnItems({
                  hasTotalColumn,
                  subColumnLookups,
                  valueKey,
                  ageRanges,
                  indicatorsSubcolumns,
                  totalText
                });

                return (
                  <Indicator
                    key={valueKey}
                    valueKey={valueKey}
                    value={value}
                    ageRanges={ageRanges}
                    displayGraph={displayGraph}
                    emptyMessage={emptyMessage}
                    groupedBy={groupedBy}
                    incompleteDataLabel={incompleteDataLabel}
                    insightMetadata={insightMetadata}
                    isGrouped={isGrouped}
                    lookups={lookups}
                    indicatorsRows={indicatorsRowsAsOptions}
                    lookupValue={lookupValue}
                    namespace={namespace}
                    subReportTitle={subReportTitle}
                    TableComponent={TableComponent}
                    totalText={GHN_VIOLATIONS_INDICATORS_IDS.includes(valueKey) ? violationsText : totalText}
                    subColumnItems={subColumnItems}
                  />
                );
              })}
          </div>
        </div>
      </LoadingIndicator>
    </div>
  );
};

Component.displayName = NAME;

export default Component;
