import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
import { fromJS } from "immutable";
import { withRouter } from "react-router-dom";
import { batch, useDispatch } from "react-redux";
import { push } from "connected-react-router";
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
import usePermissions, { ACTIONS } from "../permissions";
import PageContainer, { PageContent } from "../page";

import { NAME, DEFAULT_FILTERS } from "./constants";
import FilterContainer from "./filter-container";
import { buildTableColumns } from "./utils";
import RecordListToolbar from "./record-list-toolbar";
import { getListHeaders, getMetadata } from "./selectors";
import css from "./styles.css";
import ViewModal from "./view-modal";

const Container = ({ match, location }) => {
  const { mobileDisplay } = useThemeHelper();
  const i18n = useI18n();
  const queryParams = qs.parse(location.search.replace("?", ""));
  const [drawer, setDrawer] = useState(false);
  const { online } = useApp();
  const { url } = match;
  const { search } = location;
  const recordType = url.replace("/", "");
  const dispatch = useDispatch();

  const [openViewModal, setOpenViewModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState({});

  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));
  const headers = useMemoizedSelector(state => getListHeaders(state, recordType));
  const filters = useMemoizedSelector(state => getFiltersValuesByRecordType(state, recordType));
  const numberErrorsBulkAssign = useMemoizedSelector(state => getNumberErrorsBulkAssign(state, recordType));
  const numberRecordsBulkAssign = useMemoizedSelector(state => getNumberBulkAssign(state, recordType));

  const { canViewModal, canSearchOthers } = usePermissions(recordType, {
    canViewModal: [ACTIONS.DISPLAY_VIEW_PAGE],
    canSearchOthers: [ACTIONS.SEARCH_OTHERS]
  });

  const handleViewModalClose = () => {
    setOpenViewModal(false);
  };

  const fromDashboard = useMemo(() => Boolean(new URLSearchParams(search).get("fromDashboard")), [search]);

  const defaultMetadata = metadata?.toJS();
  const defaultFilterFields = DEFAULT_FILTERS;
  const defaultFilters = fromJS({
    ...defaultFilterFields,
    ...defaultMetadata
  });

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

    const successMessages = i18n.t("reassign.multiple_successfully", {
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

  const listHeaders =
    // eslint-disable-next-line camelcase
    filters.id_search && canSearchOthers ? headers.filter(header => header.id_search) : headers;

  const recordAvaialble = record => {
    const allowedToOpenRecord =
      record && typeof record.get("record_in_scope") !== "undefined" ? record.get("record_in_scope") : false;

    return (!online && record.get("complete", false) && allowedToOpenRecord) || (online && allowedToOpenRecord);
  };

  const handleDrawer = () => {
    setDrawer(!drawer);
  };

  const page = metadata?.get("page", 1);
  const currentPage = page - 1;

  const handleRowClick = record => {
    if (recordAvaialble(record)) {
      dispatch(push(`${recordType}/${record.get("id")}`));
    } else if (canViewModal && online) {
      setCurrentRecord(record);
      setOpenViewModal(true);
    }
  };

  const rowSelectable = record => recordAvaialble(record) || online;

  const columns = useMemo(
    () => buildTableColumns(listHeaders, i18n, recordType, css, recordAvaialble, online),
    [online, listHeaders, recordType]
  );

  return (
    <>
      <PageContainer fullWidthMobile>
        <RecordListToolbar
          title={i18n.t(`${recordType}.label`)}
          recordType={recordType}
          handleDrawer={handleDrawer}
          currentPage={currentPage}
          selectedRecords={selectedRecords}
          mobileDisplay={mobileDisplay}
        />
        <PageContent flex>
          <div className={css.tableContainer}>
            <div className={css.table}>
              <IndexTable
                title={i18n.t(`${recordType}.label`)}
                recordType={recordType}
                defaultFilters={defaultFilters}
                bypassInitialFetch
                showCustomToolbar
                columns={columns}
                onTableChange={applyFilters}
                onRowClick={handleRowClick}
                selectedRecords={selectedRecords}
                isRowSelectable={rowSelectable}
                setSelectedRecords={setSelectedRecords}
              />
            </div>
          </div>

          <FilterContainer drawer={drawer} handleDrawer={handleDrawer} mobileDisplay={mobileDisplay}>
            <Filters
              recordType={recordType}
              defaultFilters={defaultFilters}
              setSelectedRecords={setSelectedRecords}
              fromDashboard={fromDashboard}
            />
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
};

Container.displayName = NAME;

Container.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default withRouter(Container);
