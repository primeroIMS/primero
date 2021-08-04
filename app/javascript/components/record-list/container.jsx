import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import { fromJS } from "immutable";
import { withRouter } from "react-router-dom";
import { batch, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import qs from "qs";

import IndexTable from "../index-table";
import PageContainer from "../page";
import { useI18n } from "../i18n";
import Filters, { getFiltersValuesByRecordType } from "../index-filters";
import { getPermissionsByRecord } from "../user";
import { ACTIONS, DISPLAY_VIEW_PAGE, checkPermissions } from "../../libs/permissions";
import Permission from "../application/permission";
import { useMemoizedSelector, useThemeHelper } from "../../libs";
import { applyFilters } from "../index-filters/action-creators";
import { clearCaseFromIncident } from "../records/action-creators";
import { getNumberErrorsBulkAssign, getNumberBulkAssign } from "../record-actions/bulk-transtions/selectors";
import { removeBulkAssignMessages } from "../record-actions/bulk-transtions";
import { clearPreviousRecord, setSelectedForm } from "../record-form/action-creators";
import { enqueueSnackbar } from "../notifier";
import { useMetadata } from "../records";
import { DEFAULT_METADATA } from "../../config";
import { useApp } from "../application";

import { NAME, DEFAULT_FILTERS } from "./constants";
import FilterContainer from "./filter-container";
import { buildTableColumns } from "./utils";
import RecordListToolbar from "./record-list-toolbar";
import { getListHeaders, getMetadata } from "./selectors";
import styles from "./styles.css";
import ViewModal from "./view-modal";

const Container = ({ match, location }) => {
  const i18n = useI18n();
  const { css, mobileDisplay } = useThemeHelper({ css: styles });
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
  const userPermissions = useMemoizedSelector(state => getPermissionsByRecord(state, recordType));
  const filters = useMemoizedSelector(state => getFiltersValuesByRecordType(state, recordType));
  const permissions = useMemoizedSelector(state => getPermissionsByRecord(state, recordType));
  const numberErrorsBulkAssign = useMemoizedSelector(state => getNumberErrorsBulkAssign(state, recordType));
  const numberRecordsBulkAssign = useMemoizedSelector(state => getNumberBulkAssign(state, recordType));

  const canViewModal = checkPermissions(userPermissions, [ACTIONS.DISPLAY_VIEW_PAGE]);

  const handleViewModalClose = () => {
    setOpenViewModal(false);
  };
  const searchParams = new URLSearchParams(search);

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

  const canSearchOthers = permissions.includes(ACTIONS.MANAGE) || permissions.includes(ACTIONS.SEARCH_OWNED_BY_OTHERS);

  const listHeaders =
    // eslint-disable-next-line camelcase
    filters.id_search && canSearchOthers ? headers.filter(header => header.id_search) : headers;

  const recordAvaialble = record => {
    const allowedToOpenRecord =
      record && typeof record.get("record_in_scope") !== "undefined" ? record.get("record_in_scope") : false;

    return (!online && record.get("complete", false) && allowedToOpenRecord) || (online && allowedToOpenRecord);
  };

  const indexTableProps = {
    recordType,
    defaultFilters,
    bypassInitialFetch: true,
    columns: buildTableColumns(listHeaders, i18n, recordType, css, recordAvaialble, online),
    onTableChange: applyFilters,
    onRowClick: record => {
      if (recordAvaialble(record)) {
        dispatch(push(`${recordType}/${record.get("id")}`));
      } else if (canViewModal && online) {
        setCurrentRecord(record);
        setOpenViewModal(true);
      }
    },
    selectedRecords,
    isRowSelectable: record => recordAvaialble(record) || online,
    setSelectedRecords,
    showCustomToolbar: true
  };

  const handleDrawer = () => {
    setDrawer(!drawer);
  };

  const filterContainerProps = {
    mobileDisplay,
    drawer,
    handleDrawer
  };

  const page = metadata?.get("page", 1);
  const currentPage = page - 1;

  const recordListToolbarProps = {
    css,
    title: i18n.t(`${recordType}.label`),
    recordType,
    handleDrawer,
    mobileDisplay,
    currentPage,
    selectedRecords
  };

  const filterProps = {
    recordType,
    defaultFilters: fromJS({
      ...defaultFilterFields,
      ...DEFAULT_METADATA
    }),
    setSelectedRecords,
    fromDashboard: Boolean(searchParams.get("fromDashboard"))
  };

  return (
    <>
      <PageContainer fullWidthMobile>
        <Box className={css.content}>
          <Box className={css.tableContainer} flexGrow={1}>
            <RecordListToolbar {...recordListToolbarProps} />
            <Box className={css.table}>
              <IndexTable title={i18n.t(`${recordType}.label`)} {...indexTableProps} />
            </Box>
          </Box>
          <FilterContainer {...filterContainerProps}>
            <Filters {...filterProps} />
          </FilterContainer>
        </Box>
      </PageContainer>
      <Permission resources={recordType} actions={DISPLAY_VIEW_PAGE}>
        <ViewModal
          close={handleViewModalClose}
          openViewModal={openViewModal}
          currentRecord={currentRecord}
          recordType={recordType}
        />
      </Permission>
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default withRouter(Container);
