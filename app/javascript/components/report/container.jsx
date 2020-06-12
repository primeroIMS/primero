import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Paper, Typography } from "@material-ui/core";
import { push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";

import { BarChart as BarChartGraphic, TableValues } from "../charts";
import { getLoading, getErrors } from "../index-table/selectors";
import LoadingIndicator from "../loading-indicator";
import { useI18n } from "../i18n";
import { PageContainer, PageContent, PageHeading } from "../page";
import { FormAction, whichFormMode } from "../form";
import { usePermissions } from "../user";
import { WRITE_RECORDS, MANAGE } from "../../libs/permissions";
import ActionDialog from "../action-dialog";
import { selectDialog, selectDialogPending } from "../record-actions/selectors";
import { setPending, setDialog } from "../record-actions/action-creators";

import { buildDataForGraph, buildDataForTable } from "./utils";
import { getReport } from "./selectors";
import { deleteReport, fetchReport } from "./action-creators";
import namespace from "./namespace";
import { NAME, DELETE_MODAL } from "./constants";

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

  const deleteModal = useSelector(state => selectDialog(state, DELETE_MODAL));
  const setDeleteModal = open => {
    dispatch(setDialog({ dialog: DELETE_MODAL, open }));
  };

  const dialogPending = useSelector(state => selectDialogPending(state));
  const setDialogPending = pending => {
    dispatch(setPending({ pending }));
  };

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

  const canDeleteReport =
    usePermissions(namespace, MANAGE) && report.get("editable");

  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };

  const handleDelete = () => {
    setDialogPending(true);
    dispatch(
      deleteReport({
        id,
        message: i18n.t("report.messages.delete_success")
      })
    );
  };

  const editButton = formMode.get("isShow") && canEditReport && (
    <FormAction actionHandler={handleEdit} text={i18n.t("buttons.edit")} />
  );

  const cancelButton = formMode.get("isShow") && canDeleteReport && (
    <FormAction
      actionHandler={() => setDeleteModal(true)}
      cancel
      text={i18n.t("buttons.delete")}
    />
  );

  return (
    <PageContainer>
      <PageHeading
        title={report.get("name") ? report.get("name").get(i18n.locale) : ""}
      >
        {cancelButton}
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
        <ActionDialog
          open={deleteModal}
          dialogTitle={i18n.t("reports.delete_report")}
          successHandler={() => handleDelete()}
          cancelHandler={() => setDeleteModal(false)}
          omitCloseAfterSuccess
          maxSize="xs"
          pending={dialogPending}
          confirmButtonLabel={i18n.t("buttons.ok")}
        >
          <Typography color="textSecondary">
            {i18n.t("reports.delete_report_message")}
          </Typography>
        </ActionDialog>
      </PageContent>
    </PageContainer>
  );
};

Report.displayName = NAME;

Report.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Report;
