import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Paper, Typography } from "@material-ui/core";
import { push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";

import { getAgeRanges } from "../application/selectors";
import { BarChart as BarChartGraphic, TableValues } from "../charts";
import { getLoading, getErrors } from "../index-table/selectors";
import LoadingIndicator from "../loading-indicator";
import { useI18n } from "../i18n";
import PageContainer, { PageContent, PageHeading } from "../page";
import { FormAction, whichFormMode } from "../form";
import { usePermissions, WRITE_RECORDS, MANAGE } from "../permissions";
import ActionDialog, { useDialog } from "../action-dialog";
import { STRING_SOURCES_TYPES } from "../../config";
import { displayNameHelper, reduceMapToObject, useMemoizedSelector } from "../../libs";
import { clearSelectedReport } from "../reports-form/action-creators";
import useOptions from "../form/use-options";
import { formatAgeRange } from "../reports-form/utils";

import { buildGraphData, buildTableData } from "./utils";
import { getReport } from "./selectors";
import { deleteReport, fetchReport } from "./action-creators";
import namespace from "./namespace";
import { NAME, DELETE_MODAL } from "./constants";
import Exporter from "./components/exporter";
import css from "./styles.css";

const Report = ({ mode }) => {
  const { id } = useParams();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const formMode = whichFormMode(mode);
  const { pathname } = useLocation();
  const { setDialog, dialogOpen, dialogClose, pending, setDialogPending } = useDialog(DELETE_MODAL);

  useEffect(() => {
    dispatch(fetchReport(id));

    return () => {
      dispatch(clearSelectedReport());
    };
  }, []);

  const errors = useMemoizedSelector(state => getErrors(state, namespace));
  const loading = useMemoizedSelector(state => getLoading(state, namespace));
  const report = useMemoizedSelector(state => getReport(state));

  const primeroAgeRanges = useMemoizedSelector(state => getAgeRanges(state));
  const agencies = useOptions({ source: STRING_SOURCES_TYPES.AGENCY, useUniqueId: true });
  const locations = useOptions({ source: STRING_SOURCES_TYPES.LOCATION });

  const name = displayNameHelper(report.get("name"), i18n.locale);
  const description = displayNameHelper(report.get("description"), i18n.locale);
  const ageRanges = formatAgeRange(reduceMapToObject(primeroAgeRanges) || []);

  const setDeleteModal = open => {
    setDialog({ dialog: DELETE_MODAL, open });
  };

  const loadingIndicatorProps = {
    overlay: true,
    emptyMessage: i18n.t("report.no_data"),
    hasData: !!report.get("report_data", false),
    type: namespace,
    loading,
    errors
  };

  const canEditReport = usePermissions(namespace, WRITE_RECORDS) && report.get("editable");

  const canDeleteReport = usePermissions(namespace, MANAGE) && report.get("editable");

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
    <FormAction actionHandler={handleEdit} text={i18n.t("buttons.edit")} startIcon={<CreateIcon />} />
  );
  const handleClickDeleteButton = () => setDeleteModal(true);
  const handleClickSuccess = () => handleDelete();
  const handleClickCancel = () => dialogClose();

  const cancelButton = formMode.get("isShow") && canDeleteReport && (
    <FormAction
      actionHandler={handleClickDeleteButton}
      cancel
      text={i18n.t("buttons.delete")}
      startIcon={<DeleteIcon />}
    />
  );

  const reportDescription = description ? <h4 className={css.description}>{description}</h4> : null;

  return (
    <PageContainer>
      <PageHeading title={name}>
        <Exporter includesGraph={report.get("graph")} />
        {cancelButton}
        {editButton}
      </PageHeading>
      <PageContent>
        <LoadingIndicator {...loadingIndicatorProps}>
          {reportDescription}
          {report.get("graph") && (
            <Paper>
              <BarChartGraphic {...buildGraphData(report, i18n, { agencies, ageRanges, locations })} showDetails />
            </Paper>
          )}
          <TableValues {...buildTableData(report, i18n, { agencies, ageRanges, locations })} />
        </LoadingIndicator>
        <ActionDialog
          open={dialogOpen}
          dialogTitle={i18n.t("reports.delete_report")}
          successHandler={handleClickSuccess}
          cancelHandler={handleClickCancel}
          omitCloseAfterSuccess
          maxSize="xs"
          pending={pending}
          confirmButtonLabel={i18n.t("buttons.ok")}
        >
          <Typography color="textSecondary">{i18n.t("reports.delete_report_message")}</Typography>
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
