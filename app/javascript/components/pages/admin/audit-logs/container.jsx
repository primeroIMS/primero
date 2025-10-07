// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable camelcase */
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Unstable_Grid2";
import { fromJS } from "immutable";

import { getAppliedFilters, getMetadata } from "../../../record-list";
import { useI18n } from "../../../i18n";
import { DATE_TIME_FORMAT } from "../../../../config";
import Permission, { RESOURCES, SHOW_AUDIT_LOGS } from "../../../permissions";
import { compare, useMemoizedSelector } from "../../../../libs";
import { PageContent, PageHeading } from "../../../page";
import IndexTable from "../../../index-table";
import { useMetadata } from "../../../records";
import { FiltersForm } from "../../../form-filters/components";
import { filterOnTableChange, onSubmitFilters } from "../utils";
import { selectAuditLogActions, selectAuditLogRecordTypes } from "../../../application/selectors";

import { AUDIT_LOG, NAME, DEFAULT_FILTERS, TIMESTAMP, USER_NAME, AUDIT_LOG_ACTIONS, RECORD_TYPE } from "./constants";
import { fetchAuditLogs, fetchPerformedBy, setAuditLogsFilters } from "./action-creators";
import { getFilterUsers } from "./selectors";
import { buildAuditLogsQuery, getFilters } from "./utils";
import LogMessageRenderer from "./components/log-description-message";

function Container() {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const recordType = ["admin", AUDIT_LOG];

  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));
  const filterUsers = useMemoizedSelector(state => getFilterUsers(state), compare);
  const currentFilters = useMemoizedSelector(state => getAppliedFilters(state, recordType));
  const actions = useMemoizedSelector(state => selectAuditLogActions(state));
  const recordTypes = useMemoizedSelector(state => selectAuditLogRecordTypes(state));

  const defaultFilters = fromJS(DEFAULT_FILTERS).merge(metadata).set("locale", i18n.locale);

  const onTableChange = filterOnTableChange(dispatch, fetchAuditLogs, setAuditLogsFilters);

  useMetadata(recordType, metadata, fetchAuditLogs, "data");

  useEffect(() => {
    dispatch(setAuditLogsFilters({ data: defaultFilters }));
    dispatch(fetchPerformedBy({ options: { per: 999 } }));
  }, []);

  const filterProps = {
    clearFields: [USER_NAME, TIMESTAMP, AUDIT_LOG_ACTIONS, RECORD_TYPE],
    filters: getFilters(filterUsers, i18n, actions, recordTypes),
    defaultFilters,
    onSubmit: data => {
      const filters = typeof data === "undefined" ? defaultFilters : buildAuditLogsQuery(data);
      let queryParams = {};

      if (typeof data !== "undefined" && TIMESTAMP in data) {
        queryParams = data[TIMESTAMP];

        delete filters.timestamp;
      }

      const mergedFilters = currentFilters.merge(filters).merge(queryParams).set("page", 1);

      onSubmitFilters(mergedFilters, dispatch, fetchAuditLogs, setAuditLogsFilters);
    }
  };

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
          customBodyRender: (value, { rowIndex }) => (
            <LogMessageRenderer value={value} rowIndex={rowIndex} data={data} />
          )
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
          <Grid item xs={12} sm={8}>
            <IndexTable title={i18n.t("settings.navigation.audit_logs")} {...tableOptions} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FiltersForm {...filterProps} noMargin />
          </Grid>
        </Grid>
      </PageContent>
    </Permission>
  );
}

Container.displayName = NAME;

export default Container;
