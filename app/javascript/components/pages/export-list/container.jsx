import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles/";
import DownloadIcon from "@material-ui/icons/GetApp";
import CircularProgress from "@material-ui/core/CircularProgress";
import { fromJS } from "immutable";
import startCase from "lodash/startCase";
import { format, parseISO } from "date-fns";

import PageContainer, { PageHeading, PageContent } from "../../page";
import IndexTable from "../../index-table";
import { useI18n } from "../../i18n";
import { DATE_TIME_FORMAT } from "../../../config";

import { fetchExports } from "./action-creators";
import styles from "./styles.css";
import { selectListHeaders } from "./selectors";
import { NAME, EXPORT_STATUS, EXPORT_COLUMNS } from "./constants";

const ExportList = () => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const recordType = "bulk_exports";

  const listHeaders = useSelector(state =>
    selectListHeaders(state, recordType)
  );

  const isRecordProcessing = status => status === EXPORT_STATUS.processing;

  const onRowClick = record =>
    !isRecordProcessing(record.status)
      ? window.open(record.export_file, "_self")
      : null;

  const columns = data =>
    listHeaders.map(c => {
      const options = {
        ...{
          ...(c.name === EXPORT_COLUMNS.fileName
            ? {
                id: true,
                // eslint-disable-next-line react/no-multi-comp, react/display-name
                customBodyRender: (value, tableMeta) => {
                  const exportRecord = data.getIn(["data", tableMeta.rowIndex]);
                  const { status } = exportRecord;

                  const exportIcon = isRecordProcessing(status) ? (
                    <CircularProgress color="inherit" className={css.loading} />
                  ) : (
                    <DownloadIcon fontSize="small" />
                  );

                  return (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    <div
                      className={css.link}
                      onClick={() => onRowClick(exportRecord)}
                      role="button"
                      tabIndex={tableMeta.rowIndex}
                    >
                      {exportIcon}
                      <span>{value}</span>
                    </div>
                  );
                }
              }
            : {}),
          ...(c.name === EXPORT_COLUMNS.recordType
            ? {
                customBodyRender: value => startCase(value)
              }
            : {}),
          ...(c.name === EXPORT_COLUMNS.startedOn
            ? {
                customBodyRender: value =>
                  format(parseISO(value), DATE_TIME_FORMAT)
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

  const options = {
    selectableRows: "none"
  };

  const tableOptions = {
    recordType,
    columns,
    options,
    defaultFilters: fromJS({
      per: 20,
      page: 1
    }),
    onTableChange: fetchExports,
    rowHover: false,
    onRowClick: record => onRowClick(record)
  };

  return (
    <PageContainer>
      <PageHeading title={i18n.t("navigation.bulk_exports")} />
      <PageContent>
        <IndexTable
          title={i18n.t("navigation.bulk_exports")}
          {...tableOptions}
        />
      </PageContent>
    </PageContainer>
  );
};

ExportList.displayName = NAME;

ExportList.propTypes = {
  match: PropTypes.object
};

export default ExportList;
