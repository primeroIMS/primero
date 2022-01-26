import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

import { TableValues } from "../charts";
import { getLoading, getErrors } from "../index-table/selectors";
import LoadingIndicator from "../loading-indicator";
import { useI18n } from "../i18n";
import { STRING_SOURCES_TYPES } from "../../config";
import { displayNameHelper, useMemoizedSelector } from "../../libs";
import { clearSelectedReport } from "../reports-form/action-creators";
import useOptions from "../form/use-options";
import { FiltersForm } from "../form-filters/components";
import { FILTER_TYPES } from "../index-filters";

import { buildTableData } from "./utils";
import { getReport } from "./selectors";
import { fetchReport } from "./action-creators";
import namespace from "./namespace";
import { NAME } from "./constants";
import css from "./styles.css";

const Component = () => {
  const { id } = useParams();
  const i18n = useI18n();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchReport(id));

    return () => {
      dispatch(clearSelectedReport());
    };
  }, []);

  const errors = useMemoizedSelector(state => getErrors(state, namespace));
  const loading = useMemoizedSelector(state => getLoading(state, namespace));
  const report = useMemoizedSelector(state => getReport(state));

  const agencies = useOptions({ source: STRING_SOURCES_TYPES.AGENCY, useUniqueId: true });
  const locations = useOptions({ source: STRING_SOURCES_TYPES.LOCATION });

  const description = displayNameHelper(report.get("description"), i18n.locale);

  const loadingIndicatorProps = {
    overlay: true,
    emptyMessage: i18n.t("report.no_data"),
    hasData: !!report.get("report_data", false),
    type: namespace,
    loading,
    errors
  };

  const reportDescription = description ? <h4 className={css.description}>{description}</h4> : null;

  const filters = [
    {
      name: "Test Filter",
      field_name: "test field",
      type: FILTER_TYPES.MULTI_TOGGLE,
      options: []
    }
  ];

  const handleFilterSubmit = () => {};

  return (
    <LoadingIndicator {...loadingIndicatorProps}>
      <div className={css.subReportContent}>
        <div className={css.subReportTables}>
          {reportDescription}
          <TableValues {...buildTableData(report, i18n, { agencies, locations })} />
          <TableValues {...buildTableData(report, i18n, { agencies, locations })} />
          <TableValues {...buildTableData(report, i18n, { agencies, locations })} />
          <TableValues {...buildTableData(report, i18n, { agencies, locations })} />
        </div>
        <FiltersForm filters={filters} onSubmit={handleFilterSubmit} />
      </div>
    </LoadingIndicator>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Component;
