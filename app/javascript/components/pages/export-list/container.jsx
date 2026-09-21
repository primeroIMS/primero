/* eslint-disable react/no-multi-comp, react/display-name */
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useState } from "react";
import DownloadIcon from "@mui/icons-material/GetApp";
import CircularProgress from "@mui/material/CircularProgress";
import startCase from "lodash/startCase";
import Delete from "@mui/icons-material/Delete";

import { RESOURCES, usePermissions } from "../../permissions";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../action-button";
import DisableOffline from "../../disable-offline";
import PageContainer, { PageHeading, PageContent } from "../../page";
import IndexTable from "../../index-table";
import { useI18n } from "../../i18n";
import { DATE_TIME_FORMAT, FETCH_PARAM } from "../../../config";
import { getMetadata } from "../../record-list";
import { useMetadata } from "../../records";
import { useMemoizedSelector } from "../../../libs";
import downloadUrl from "../../../libs/download-url";
import ActionDialog from "../../action-dialog";
import { ACTIONS } from "../../permissions/constants";

import { deleteExport as deleteExportAction, fetchExports } from "./action-creators";
import css from "./styles.css";
import { selectListHeaders } from "./selectors";
import { NAME, EXPORT_STATUS, EXPORT_COLUMNS } from "./constants";

function ExportList() {
  const recordType = "bulk_exports";
  const i18n = useI18n();
  const dispatch = useDispatch();

  const canDelete = usePermissions(RESOURCES.exports, ACTIONS.DELETE);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const listHeaders = useMemoizedSelector(state => selectListHeaders(state, recordType));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));

  const defaultFilters = metadata;
  const isRecordProcessing = status => status === EXPORT_STATUS.processing;

  const onRowClick = record => {
    if (!isRecordProcessing(record.status)) {
      downloadUrl(record.export_file, record.file_name);
    }
  };

  const deleteExport = () => {
    dispatch(deleteExportAction(deleteId));
    setConfirmDelete(false);
    setDeleteId(null);
  };

  const onCloseModal = () => {
    setDeleteId(null);
    setConfirmDelete(false);
  };

  const columns = data => {
    const deleteRow = {
      name: "actions",
      label: false,
      options: {
        sort: false,
        disableOnClick: true,
        customHeadLabelRender: () => <span />,
        setCellHeaderProps: () => {
          return { style: { width: "45px" } };
        },
        customBodyRender: (_row, { rowIndex }) => (
          <ActionButton
            id="form-record-actions"
            icon={<Delete />}
            type={ACTION_BUTTON_TYPES.icon}
            rest={{
              onClick: () => {
                const rowID = data.getIn(["data", rowIndex, "id"]);

                setConfirmDelete(true);
                setDeleteId(rowID);
              },
              "aria-label": "more",
              "aria-controls": "long-menu",
              "aria-haspopup": "true"
            }}
          />
        )
      }
    };

    const headers = listHeaders.map(c => {
      const options = {
        ...{
          ...(c.name === EXPORT_COLUMNS.fileName
            ? {
                id: true,
                customBodyRender: (value, tableMeta) => {
                  const exportRecord = data.getIn(["data", tableMeta.rowIndex]);
                  const { status } = exportRecord;

                  const exportIcon = isRecordProcessing(status) ? (
                    <CircularProgress color="inherit" className={css.loading} />
                  ) : (
                    <DownloadIcon fontSize="small" />
                  );

                  return (
                    <DisableOffline>
                      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                      <div className={css.link} role="button" tabIndex={tableMeta.rowIndex}>
                        {exportIcon}
                        <span>{value}</span>
                      </div>
                    </DisableOffline>
                  );
                }
              }
            : {}),
          ...(c.name === EXPORT_COLUMNS.recordType
            ? {
                customBodyRender: value => (
                  <DisableOffline>
                    <span>{startCase(value)}</span>
                  </DisableOffline>
                )
              }
            : {}),
          ...(c.name === EXPORT_COLUMNS.startedOn
            ? {
                customBodyRender: value => (
                  <DisableOffline>
                    <span>{i18n.localizeDate(value, DATE_TIME_FORMAT)}</span>
                  </DisableOffline>
                )
              }
            : {})
        }
      };

      return {
        name: c.field_name,
        label: i18n.t(`bulk_export.${c.name}`),
        options
      };
    });

    if (canDelete) {
      return [...headers, deleteRow];
    }

    return headers;
  };

  const options = {
    selectableRows: "none"
  };

  useMetadata(recordType, metadata, fetchExports, FETCH_PARAM.DATA);

  const tableOptions = {
    recordType,
    columns,
    options,
    defaultFilters,
    onTableChange: fetchExports,
    rowHover: false,
    onRowClick: record => onRowClick(record),
    bypassInitialFetch: true
  };

  return (
    <PageContainer>
      <PageHeading data-testid="page-heading" title={i18n.t("navigation.bulk_exports")} />
      <PageContent>
        <IndexTable title={i18n.t("navigation.bulk_exports")} {...tableOptions} />
        <ActionDialog
          open={confirmDelete}
          successHandler={deleteExport}
          cancelHandler={onCloseModal}
          dialogTitle={i18n.t("bulk_export.delete.header")}
          dialogText={i18n.t("bulk_export.delete.confirmation")}
          confirmButtonLabel={i18n.t("buttons.delete")}
        />
      </PageContent>
    </PageContainer>
  );
}

ExportList.displayName = NAME;

ExportList.propTypes = {
  match: PropTypes.object
};

export default ExportList;
