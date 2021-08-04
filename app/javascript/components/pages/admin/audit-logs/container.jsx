/* eslint-disable camelcase */
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Grid } from "@material-ui/core";
import { fromJS } from "immutable";

import { getAppliedFilters, getMetadata } from "../../../record-list";
import { useI18n } from "../../../i18n";
import { DATE_TIME_FORMAT } from "../../../../config";
import { RESOURCES, SHOW_AUDIT_LOGS } from "../../../../libs/permissions";
import { compare, useMemoizedSelector } from "../../../../libs";
import { PageContent, PageHeading } from "../../../page";
import IndexTable from "../../../index-table";
import Permission from "../../../application/permission";
import { useMetadata } from "../../../records";
import { FiltersForm } from "../../../form-filters/components";
import { filterOnTableChange, onSubmitFilters } from "../utils";

import { AUDIT_LOG, NAME, DEFAULT_FILTERS, TIMESTAMP, USER_NAME } from "./constants";
import { fetchAuditLogs, fetchPerformedBy, setAuditLogsFilters } from "./action-creators";
import { getFilterUsers } from "./selectors";
import { buildAuditLogsQuery, getFilters } from "./utils";

const Container = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const recordType = ["admin", AUDIT_LOG];

  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));
  const filterUsers = useMemoizedSelector(state => getFilterUsers(state), compare);
  const currentFilters = useMemoizedSelector(state => getAppliedFilters(state, recordType));

  const defaultFilters = fromJS(DEFAULT_FILTERS).merge(metadata).set("locale", i18n.locale);

  const onTableChange = filterOnTableChange(dispatch, fetchAuditLogs, setAuditLogsFilters);

  useEffect(() => {
    dispatch(fetchPerformedBy({ options: { per: 999 } }));
  }, []);

  const filterProps = {
    clearFields: [USER_NAME, TIMESTAMP],
    filters: getFilters(filterUsers),
    defaultFilters,
    onSubmit: data => {
      const filters = typeof data === "undefined" ? {} : buildAuditLogsQuery(data);
      let queryParams = {};

      if (typeof data !== "undefined" && TIMESTAMP in data) {
        queryParams = data[TIMESTAMP];

        delete filters.timestamp;
      }

      const newFilters =
        typeof data === "undefined"
          ? currentFilters.deleteAll([USER_NAME, "to", "from"])
          : currentFilters.merge(filters).merge(queryParams);

      onSubmitFilters(newFilters, dispatch, fetchAuditLogs, setAuditLogsFilters);
    }
  };

  useMetadata(recordType, metadata, fetchAuditLogs, "data");

  const columns = data => {
    return [
      {
        label: i18n.t("audit_log.timestamp"),
        name: "timestamp",
        options: {
          customBodyRender: value => i18n.localizeDate(value, DATE_TIME_FORMAT)
        }
      },
      {
        label: i18n.t("audit_log.user_name"),
        name: "user_name"
      },
      {
        label: i18n.t("audit_log.action"),
        name: "action",
        options: {
          customBodyRender: value => i18n.t(`logger.actions.${value}`)
        }
      },
      {
        label: i18n.t("audit_log.description"),
        name: "log_message",
        options: {
          sort: false,
          customBodyRender: (value, { rowIndex }) => {
            const prefix = value?.prefix?.approval_type
              ? i18n.t(value?.prefix?.key, { approval_label: value?.prefix?.approval_type })
              : i18n.t(value?.prefix?.key);

            return `${prefix} ${i18n.t(`logger.resources.${data.getIn(["data", rowIndex, "record_type"])}`)}`;
          }
        }
      },
      {
        label: i18n.t("audit_log.record_owner"),
        name: "record_user_name",
        options: {
          customBodyRender: (value, { rowData }) => (rowData ? rowData[1] : null)
        }
      }
    ];
  };

  const tableOptions = {
    columns,
    defaultFilters,
    onTableChange,
    options: {
      selectableRows: "none",
      onCellClick: false
    },
    recordType,
    targetRecordType: AUDIT_LOG,
    bypassInitialFetch: true
  };

  return (
    <Permission resources={RESOURCES.audit_logs} actions={SHOW_AUDIT_LOGS} redirect>
      <PageHeading title={i18n.t("settings.navigation.audit_logs")} />
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <IndexTable title={i18n.t("settings.navigation.audit_logs")} {...tableOptions} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FiltersForm {...filterProps} />
          </Grid>
        </Grid>
      </PageContent>
    </Permission>
  );
};

Container.displayName = NAME;

export default Container;
