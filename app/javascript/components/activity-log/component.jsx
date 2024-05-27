// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import { batch, useDispatch } from "react-redux";
import { push } from "connected-react-router";

import useMemoizedSelector from "../../libs/use-memoized-selector";
import { RESOURCES } from "../permissions";
import { useI18n } from "../i18n";
import { getAppliedFilters } from "../record-list";
import IndexTable from "../index-table";
import PageContainer, { PageHeading, PageContent } from "../page";

import { getColumns, getRecordPath } from "./utils";
import { fetchActivityLog, setActivityLogsFilter } from "./action-creators";
import css from "./styles.css";

const Component = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const recordType = RESOURCES.activity_logs;

  const currentFilters = useMemoizedSelector(state => getAppliedFilters(state, recordType));

  const defaultFilters = currentFilters;

  const onTableChange = filters => {
    const filtersData = { data: filters.data };

    dispatch(setActivityLogsFilter({ data: filtersData }));

    return fetchActivityLog(filtersData);
  };

  const tableOptions = {
    recordType: RESOURCES.activity_logs,
    columns: getColumns(),
    options: {
      selectableRows: "none",
      pagination: false
    },
    defaultFilters,
    onTableChange,
    bypassInitialFetch: true,
    selectedRecords: {},
    onRowClick: record => {
      if (!record.get("record_access_denied")) {
        dispatch(push(getRecordPath(record)));
      }
    }
  };

  useEffect(() => {
    batch(() => {
      dispatch(setActivityLogsFilter({ data: defaultFilters }));
      dispatch(fetchActivityLog({ data: defaultFilters }));
    });
  }, []);

  return (
    <PageContainer>
      <PageHeading title={i18n.t("navigation.activity_log")} />
      <PageContent>
        <div className={css.activityLogContent}>
          <IndexTable {...tableOptions} />
        </div>
      </PageContent>
    </PageContainer>
  );
};

Component.displayName = "ActivityLog";

export default Component;
