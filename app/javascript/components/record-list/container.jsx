// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useState, useEffect, useMemo, useCallback } from "react";
import { fromJS } from "immutable";
import { withRouter } from "react-router-dom";
import { batch, useDispatch } from "react-redux";
import { push, replace } from "connected-react-router";
import qs from "qs";

import IndexTable from "../index-table";
import { useI18n } from "../i18n";
import Filters, { getFiltersValuesByRecordType } from "../index-filters";
import { useMemoizedSelector, useThemeHelper } from "../../libs";
import { applyFilters } from "../index-filters/action-creators";
import { clearCaseFromIncident } from "../records/action-creators";
import { getNumberErrorsBulkAssign, getNumberBulkAssign } from "../record-actions/bulk-transtions/selectors";
import { removeBulkAssignMessages } from "../record-actions/bulk-transtions";
import { clearPreviousRecord, setSelectedForm } from "../record-form/action-creators";
import { enqueueSnackbar } from "../notifier";
import { useMetadata } from "../records";
import { useApp } from "../application";
import { usePermissions, ACTIONS } from "../permissions";
import PageContainer, { PageContent } from "../page";

import { NAME, DEFAULT_FILTERS } from "./constants";
import { buildTableColumns } from "./utils";
import RecordListToolbar from "./record-list-toolbar";
import { getListHeaders, getMetadata, getAppliedFiltersAsQueryString } from "./selectors";
import css from "./styles.css";
import ViewModal from "./view-modal";
import SortContainer from "./components/sort-container";
import FilterContainer from "./components/filter-container";

function Container({ match, location }) {
  const { mobileDisplay } = useThemeHelper();
  const i18n = useI18n();
  const currentQueryString = location.search.replace("?", "");
  const { online } = useApp();
  const { url } = match;
  const recordType = url.replace("/", "");
  const dispatch = useDispatch();

  const [openViewModal, setOpenViewModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState({});

  const filtersQueryString = useMemoizedSelector(state => getAppliedFiltersAsQueryString(state, recordType));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));
  const headers = useMemoizedSelector(state => getListHeaders(state, recordType));
  const filters = useMemoizedSelector(state => getFiltersValuesByRecordType(state, recordType));
  const numberErrorsBulkAssign = useMemoizedSelector(state => getNumberErrorsBulkAssign(state, recordType));
  const numberRecordsBulkAssign = useMemoizedSelector(state => getNumberBulkAssign(state, recordType));

  const { canViewModal, canSearchOthers } = usePermissions(recordType, {
    canViewModal: [ACTIONS.DISPLAY_VIEW_PAGE],
    canSearchOthers: [ACTIONS.SEARCH_OTHERS]
  });

  const queryParams = useMemo(() => qs.parse(currentQueryString), [currentQueryString]);

  const defaultFilters = useMemo(
    () => fromJS(Object.keys(queryParams).length ? queryParams : DEFAULT_FILTERS).merge(metadata),
    [metadata, queryParams]
  );

  useMetadata(recordType, metadata, applyFilters, "data", {
    defaultFilterFields: Object.keys(queryParams).length ? queryParams : defaultFilters.toJS(),
    restActionParams: { recordType }
  });

  useEffect(() => {
    dispatch(clearPreviousRecord());
  }, []);

  useEffect(() => {
    const errorMessages = i18n.t("reassign.multiple_error", {
      select_records: numberErrorsBulkAssign
    });

    const successMessages = i18n.t(`${recordType}.reassign.multiple_successfully`, {
      select_records: numberRecordsBulkAssign
    });

    if (numberErrorsBulkAssign) {
      dispatch(enqueueSnackbar(errorMessages, { type: "error" }));
    }
    if (numberRecordsBulkAssign) {
      dispatch(enqueueSnackbar(successMessages, { type: "success" }));
    }

    return () => {
      dispatch(removeBulkAssignMessages(recordType));
    };
  }, [numberErrorsBulkAssign, numberRecordsBulkAssign]);

  useEffect(() => {
    batch(() => {
      dispatch(setSelectedForm(null));
      dispatch(clearCaseFromIncident());
    });
  }, []);

  useEffect(() => {
    if (filtersQueryString && currentQueryString !== filtersQueryString) {
      dispatch(replace({ search: filtersQueryString }));
    }
  }, [currentQueryString, filtersQueryString]);

  const handleViewModalClose = useCallback(() => {
    setOpenViewModal(false);
  }, []);

  const listHeaders = useMemo(
    () =>
      // eslint-disable-next-line camelcase
      filters.id_search && canSearchOthers ? headers.filter(header => header.id_search) : headers,
    [filters.id_search, headers, canSearchOthers]
  );

  const recordAvailable = useCallback(
    record => {
      const allowedToOpenRecord =
        record && typeof record.get("record_in_scope") !== "undefined" ? record.get("record_in_scope") : false;

      return (!online && record.get("complete", false) && allowedToOpenRecord) || (online && allowedToOpenRecord);
    },
    [online]
  );

  const clearSelectedRecords = useCallback(() => {
    setSelectedRecords({});
  }, []);

  const page = metadata?.get("page", 1);
  const currentPage = page - 1;

  const handleRowClick = useCallback(
    record => {
      if (recordAvailable(record)) {
        dispatch(push(`${recordType}/${record.get("id")}`));
      } else if (canViewModal && online) {
        setCurrentRecord(record);
        setOpenViewModal(true);
      }
    },
    [canViewModal, online]
  );

  const rowSelectable = useCallback(record => recordAvailable(record) || online, [online]);

  const phonetic = useMemo(() => queryParams.phonetic === "true", [queryParams.phonetic]);

  const columns = useMemo(
    () => buildTableColumns(listHeaders, i18n, recordType, css, recordAvailable, online, phonetic),
    [online, listHeaders, recordType, phonetic]
  );

  const handleSelectedRecords = useCallback(ids => {
    setSelectedRecords(ids);
  }, []);

  const title = i18n.t(`${recordType}.label`);

  return (
    <>
      <PageContainer fullWidthMobile>
        <RecordListToolbar
          title={title}
          recordType={recordType}
          currentPage={currentPage}
          selectedRecords={selectedRecords}
          clearSelectedRecords={clearSelectedRecords}
          phonetic={phonetic}
        />
        <PageContent flex>
          <div className={css.tableContainer}>
            <div className={css.table}>
              <IndexTable
                title={title}
                recordType={recordType}
                defaultFilters={defaultFilters}
                bypassInitialFetch
                showCustomToolbar
                columns={columns}
                onTableChange={applyFilters}
                onRowClick={handleRowClick}
                selectedRecords={selectedRecords}
                isRowSelectable={rowSelectable}
                setSelectedRecords={handleSelectedRecords}
              />
            </div>
          </div>

          {mobileDisplay && !phonetic && (
            <SortContainer columns={columns} recordType={recordType} applyFilters={applyFilters} />
          )}
          <FilterContainer mobileDisplay={mobileDisplay}>
            <Filters recordType={recordType} setSelectedRecords={handleSelectedRecords} metadata={metadata} />
          </FilterContainer>
        </PageContent>
      </PageContainer>
      {canViewModal && (
        <ViewModal
          close={handleViewModalClose}
          openViewModal={openViewModal}
          currentRecord={currentRecord}
          recordType={recordType}
        />
      )}
    </>
  );
}

Container.displayName = NAME;

Container.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default withRouter(Container);
