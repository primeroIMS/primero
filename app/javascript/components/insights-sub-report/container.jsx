// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { fromJS } from "immutable";
import { useDispatch } from "react-redux";
import isNil from "lodash/isNil";

import { getLoading, getErrors } from "../index-table/selectors";
import LoadingIndicator from "../loading-indicator";
import { useI18n } from "../i18n";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import useOptions from "../form/use-options";

import AggregateInsight from "./components/aggregate-insight";
import SingleInsight from "./components/single-insight";
import { buildReportData, getLookupValue } from "./utils";
import { getInsight } from "./selectors";
import namespace from "./namespace";
import { NAME } from "./constants";
import css from "./styles.css";
import { setSubReport } from "./action-creators";
import transformIndicatorsRows from "./utils/transform-indicators-rows";

function Component() {
  const { id, subReport } = useParams();
  const i18n = useI18n();
  const dispatch = useDispatch();

  useEffect(() => {
    if (subReport) {
      dispatch(setSubReport(subReport));
    }
  }, [subReport]);

  const errors = useMemoizedSelector(state => getErrors(state, namespace));
  const loading = useMemoizedSelector(state => getLoading(state, namespace));
  const insight = useMemoizedSelector(state => getInsight(state));

  const insightMetadata = insight.getIn(["report_data", subReport, "metadata"], fromJS({}));
  const insightLookups = insightMetadata.get("lookups", fromJS({})).entrySeq().toArray();
  const indicatorsRows = insightMetadata.get("indicators_rows", fromJS({}));
  const indicatorsRowsAsOptions = useMemo(
    () => transformIndicatorsRows(indicatorsRows, i18n.locale),
    [indicatorsRows, i18n.locale]
  );

  const lookups = useOptions({ source: insightLookups });

  const labels = useMemo(
    () => ({
      empty: i18n.t("managed_reports.no_data_table"),
      total: i18n.t("managed_reports.total"),
      incompleteData: i18n.t("managed_reports.incomplete_data")
    }),
    [i18n.locale]
  );

  const tableType = insightMetadata?.get("table_type") || "default";

  const reportData = useMemo(() => buildReportData(insight, subReport), [insight, subReport]);

  const translateId = valueID => {
    if (isNil(valueID) || valueID === "incomplete_data") {
      return labels.incompleteData;
    }

    return i18n.t(`managed_reports.${id}.sub_reports.${valueID}`, { defaultValue: valueID });
  };

  const subReportTitle = key => i18n.t(["managed_reports", id, "sub_reports", key].join("."));

  const lookupValue = (data, key, property) =>
    getLookupValue(lookups, indicatorsRowsAsOptions, translateId, data, key, property, labels.total);

  const hasData = !!insight.getIn(["report_data", subReport], false);

  const singleInsightData = reportData.get("single", fromJS({}));
  const aggregateInsightData = reportData.get("aggregate", fromJS({}));

  return (
    <div className={css.container}>
      <LoadingIndicator
        overlay
        emptyMessage={labels.empty}
        hasData={hasData && !loading}
        type={namespace}
        loading={loading}
        errors={errors}
      >
        <div className={css.subReportContent}>
          <h2 className={css.description}>{i18n.t(insight.get("description"))}</h2>
          {singleInsightData.size > 0 && (
            <SingleInsight
              data={singleInsightData}
              labels={labels}
              lookupValue={lookupValue}
              subReport={subReport}
              subReportTitle={subReportTitle("combined")}
              tableType={tableType}
            />
          )}

          {aggregateInsightData.size > 0 &&
            aggregateInsightData.entrySeq().map(([valueKey, value]) => {
              return (
                <AggregateInsight
                  key={valueKey}
                  indicatorKey={valueKey}
                  indicatorData={value}
                  indicatorRows={indicatorsRowsAsOptions}
                  subReport={subReport}
                  subReportTitle={subReportTitle(valueKey)}
                  insight={insight}
                  labels={labels}
                  lookups={lookups}
                  lookupValue={lookupValue}
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
