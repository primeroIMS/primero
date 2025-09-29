// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { useMemo } from "react";
import isString from "lodash/isString";

import namespace from "../../namespace";
import { useI18n } from "../../../i18n";
import { useMemoizedSelector } from "../../../../libs";
import { getFormattedAgeRanges } from "../../../application/selectors";
import { getIndicatorSubcolumnKeys, getSubColumnItems, hasTotalColumn } from "../../utils";
import {
  GHN_VIOLATIONS_INDICATORS_IDS,
  GROUPED_BY_FILTER,
  HEADER_TITLE_KEYS,
  PERCENTAGE_INDICATORS
} from "../../constants";
import { OPTION_TYPES } from "../../../form";
import useOptions from "../../../form/use-options";
import { REFERRAL_TRANSFERS_SUBREPORTS } from "../../../../config";
import InsightTableValues from "../table-values";
import MultipleViolationsIndicator from "../multiple-violations-indicator";
import DefaultIndicator from "../default-indicator";
import { getInsightFilter } from "../../selectors";

const cellRender = (val, index) => (index === 0 ? val : `${val}%`);

const chartRender = val => `${val}%`;

const getIndicator = indicator => {
  if (indicator === "multiple_violations") {
    return MultipleViolationsIndicator;
  }

  return DefaultIndicator;
};

function Component({
  insight,
  indicatorKey,
  indicatorData,
  indicatorRows,
  labels,
  lookups,
  lookupValue,
  subReport,
  subReportTitle
}) {
  const i18n = useI18n();
  const groupedBy = useMemoizedSelector(state => getInsightFilter(state, GROUPED_BY_FILTER));
  const ageRanges = useMemoizedSelector(state => getFormattedAgeRanges(state));
  const isGHNIndicator = GHN_VIOLATIONS_INDICATORS_IDS.includes(indicatorKey);

  const indicatorLabels = useMemo(
    () => ({
      ...labels,
      total: isGHNIndicator ? i18n.t("managed_reports.violations_total") : labels.total
    }),
    [i18n.locale]
  );

  const includeZeros = insight.get("include_zeros", false);
  const insightMetadata = insight.getIn(["report_data", subReport, "metadata"], fromJS({}));
  const displayGraph = insightMetadata.get("display_graph", true);
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
  const subColumnLookups = useOptions({ source: indicatorSubcolumnLookups });
  const isReferralsTransferSubreport = REFERRAL_TRANSFERS_SUBREPORTS.includes(subReport);
  const indicatorIsGrouped = indicatorData.some(elem => elem.get("group_id"));
  const indicatorHasTotalColumn = hasTotalColumn(indicatorIsGrouped, indicatorData);
  const indicatorSubColumnKeys = getIndicatorSubcolumnKeys(indicatorData);
  const Indicator = getIndicator(indicatorKey);

  const subColumnItems = getSubColumnItems({
    hasTotalColumn: indicatorHasTotalColumn,
    subColumnLookups,
    valueKey: indicatorKey,
    ageRanges,
    indicatorsSubcolumns,
    indicatorSubColumnKeys,
    includeAllSubColumns: !isReferralsTransferSubreport,
    labels
  });

  const headerTitle = headerKeys[indicatorKey] ? i18n.t(headerKeys[indicatorKey]) : null;
  const cellValueRender = PERCENTAGE_INDICATORS.includes(indicatorKey) ? cellRender : null;
  const chartValueRender = PERCENTAGE_INDICATORS.includes(indicatorKey) ? chartRender : null;

  return (
    <Indicator
      indicatorKey={indicatorKey}
      value={indicatorData}
      includeZeros={includeZeros}
      ageRanges={ageRanges}
      displayGraph={displayGraph}
      labels={indicatorLabels}
      groupedBy={groupedBy}
      insightMetadata={insightMetadata}
      isGrouped={indicatorIsGrouped}
      lookups={lookups[indicatorKey]}
      indicatorRows={indicatorRows[indicatorKey]}
      lookupValue={lookupValue}
      namespace={namespace}
      headerTitle={headerTitle}
      subReportTitle={subReportTitle}
      TableComponent={InsightTableValues}
      subColumnItems={subColumnItems}
      hasTotalColumn={indicatorHasTotalColumn}
      cellValueRender={cellValueRender}
      chartValueRender={chartValueRender}
    />
  );
}

Component.displayName = "AggregateIndicator";

Component.propTypes = {
  indicatorData: PropTypes.object,
  indicatorKey: PropTypes.string,
  indicatorRows: PropTypes.object,
  insight: PropTypes.object,
  labels: PropTypes.object,
  lookups: PropTypes.object,
  lookupValue: PropTypes.func,
  subReport: PropTypes.string,
  subReportTitle: PropTypes.string
};

export default Component;
