import { useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { fromJS, List, Map } from "immutable";
import take from "lodash/take";
import isEmpty from "lodash/isEmpty";
import { useDispatch } from "react-redux";
import { isEmpty } from "lodash";

import { getLoading, getErrors } from "../index-table/selectors";
import LoadingIndicator from "../loading-indicator";
import { useI18n } from "../i18n";
import { useMemoizedSelector } from "../../libs";
import { clearSelectedReport } from "../reports-form/action-creators";
import TableValues from "../charts/table-values";
import BarChartGraphic from "../charts/bar-chart";
import useOptions from "../form/use-options";
import { CHART_COLORS } from "../../config/constants";
import InsightsFilters from "../insights-filters";

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

  const getLookupValue = (key, value) => {
    const valueKeyLookups = lookups[key];

    if (isEmpty(valueKeyLookups)) {
      return i18n.t(["managed_reports", id, "sub_reports", value.get("id")].join("."), {
        defaultValue: value.get("id")
      });
    }

    // eslint-disable-next-line camelcase
    return valueKeyLookups.find(lookup => lookup.id === value.get("id"))?.display_text || value.get("id");
  };

  const buildInsightValues = (data, key) => {
    if (data === 0) return [];

    return data
      .map(value => {
        const lookupValue = getLookupValue(key, value);

        return { colspan: 0, row: [lookupValue, value.get("total")] };
      })
      .toArray();
  };

  const buildChartValues = (value, valueKey) => {
    if (!value) return {};

    const data = value?.map(val => val.get("total")).toArray();

    return {
      datasets: [
        {
          label: totalText,
          data,
          backgroundColor: take(Object.values(CHART_COLORS), data.length)
        }
      ],
      labels: value
        .map(val => {
          const valueID = val.get("id");
          const valueKeyLookups = lookups[valueKey];

          if (isEmpty(valueKeyLookups)) {
            return i18n.t(["managed_reports", id, "sub_reports", valueID].join("."), { defaultValue: valueID });
          }

          // eslint-disable-next-line camelcase
          return valueKeyLookups.find(lookup => lookup.id === valueID)?.display_text || valueID;
        })
        .toArray()
    };
  };

  const subReportTitle = key => i18n.t(["managed_reports", id, "sub_reports", key].join("."));

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
                  <BarChartGraphic data={buildChartValues(value, valueKey)} showDetails />
                  <TableValues
                    values={buildInsightValues(value, valueKey)}
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
