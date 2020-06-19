import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
import { push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";

import { BarChart as BarChartGraphic, TableValues } from "../charts";
import { getLoading, getErrors } from "../index-table/selectors";
import LoadingIndicator from "../loading-indicator";
import { useI18n } from "../i18n";
import PageContainer, { PageContent, PageHeading } from "../page";
import { FormAction, whichFormMode } from "../form";
import { usePermissions } from "../user";
import { WRITE_RECORDS } from "../../libs/permissions";

import { buildDataForGraph, buildDataForTable } from "./utils";
import { getReport } from "./selectors";
import { fetchReport } from "./action-creators";
import namespace from "./namespace";

const Report = ({ mode }) => {
  const { id } = useParams();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const formMode = whichFormMode(mode);
  const { pathname } = useLocation();

  useEffect(() => {
    dispatch(fetchReport(id));
  }, []);

  const errors = useSelector(state => getErrors(state, namespace));
  const loading = useSelector(state => getLoading(state, namespace));
  const report = useSelector(state => getReport(state));

  const loadingIndicatorProps = {
    overlay: true,
    emptyMessage: i18n.t("report.no_data"),
    hasData: !!report.get("report_data", false),
    type: namespace,
    loading,
    errors
  };

  const canEditReport =
    usePermissions(namespace, WRITE_RECORDS) && report.get("editable");

  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };

  const editButton = formMode.get("isShow") && canEditReport && (
    <FormAction actionHandler={handleEdit} text={i18n.t("buttons.edit")} />
  );

  return (
    <PageContainer>
      <PageHeading
        title={report.get("name") ? report.get("name").get(i18n.locale) : ""}
      >
        {editButton}
      </PageHeading>
      <PageContent>
        <LoadingIndicator {...loadingIndicatorProps}>
          {report.get("graph") && (
            <Paper>
              <BarChartGraphic
                {...buildDataForGraph(report, i18n)}
                showDetails
              />
            </Paper>
          )}
          <TableValues {...buildDataForTable(report, i18n)} />
        </LoadingIndicator>
      </PageContent>
    </PageContainer>
  );
};

Report.displayName = "Report";

Report.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Report;
