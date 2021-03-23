/* eslint-disable react/no-multi-comp, react/display-name */
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DownloadIcon from "@material-ui/icons/GetApp";
import CircularProgress from "@material-ui/core/CircularProgress";
import startCase from "lodash/startCase";

import DisableOffline from "../../disable-offline";
import PageContainer, { PageHeading, PageContent } from "../../page";
import IndexTable from "../../index-table";
import { useI18n } from "../../i18n";
import { DATE_TIME_FORMAT, FETCH_PARAM } from "../../../config";
import { getMetadata } from "../../record-list";
import { useMetadata } from "../../records";
import { useMemoizedSelector } from "../../../libs";

import { fetchExports } from "./action-creators";
import styles from "./styles.css";
import { selectListHeaders } from "./selectors";
import { NAME, EXPORT_STATUS, EXPORT_COLUMNS } from "./constants";

const useStyles = makeStyles(styles);

const ExportList = () => {
  const i18n = useI18n();
  const css = useStyles();
  const recordType = "bulk_exports";

  const listHeaders = useMemoizedSelector(state => selectListHeaders(state, recordType));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));

  const defaultFilters = metadata;
  const isRecordProcessing = status => status === EXPORT_STATUS.processing;

  const onRowClick = record => (!isRecordProcessing(record.status) ? window.open(record.export_file, "_self") : null);

  const columns = data => {
    const handleClick = exportRecord => () => onRowClick(exportRecord);

    return listHeaders.map(c => {
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
                      <div
                        className={css.link}
                        onClick={handleClick(exportRecord)}
                        role="button"
                        tabIndex={tableMeta.rowIndex}
                      >
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
      <PageHeading title={i18n.t("navigation.bulk_exports")} />
      <PageContent>
        <IndexTable title={i18n.t("navigation.bulk_exports")} {...tableOptions} />
      </PageContent>
    </PageContainer>
  );
};

ExportList.displayName = NAME;

ExportList.propTypes = {
  match: PropTypes.object
};

export default ExportList;
