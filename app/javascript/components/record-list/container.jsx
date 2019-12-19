import PropTypes from "prop-types";
import React, { useState } from "react";
import { Box, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { fromJS } from "immutable";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";

import IndexTable from "../index-table";
import { PageContainer } from "../page";
import { useI18n } from "../i18n";
import Filters, { getFiltersValuesByRecordType } from "../index-filters";
import { getPermissionsByRecord } from "../user";
import {
  ACTIONS,
  DISPLAY_VIEW_PAGE,
  checkPermissions
} from "../../libs/permissions";
import Permission from "../application/permission";
import { useThemeHelper } from "../../libs";

import { NAME } from "./config";
import FilterContainer from "./filter-container";
import { buildTableColumns, getRecordsFetcherByType } from "./helpers";
import RecordListToolbar from "./record-list-toolbar";
import { getListHeaders } from "./selectors";
import styles from "./styles.css";
import { ViewModal } from "./view-modal";

const Container = ({ match, location }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const { theme } = useThemeHelper({});
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawer, setDrawer] = useState(false);

  const { url } = match;
  const { search } = location;
  const recordType = url.replace("/", "");
  const dispatch = useDispatch();
  const headers = useSelector(state => getListHeaders(state, recordType));
  const [openViewModal, setOpenViewModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const userPermissions = useSelector(state =>
    getPermissionsByRecord(state, recordType)
  );

  const canViewModal = checkPermissions(userPermissions, [
    ACTIONS.DISPLAY_VIEW_PAGE
  ]);

  const handleViewModalClose = () => {
    setOpenViewModal(false);
  };
  const searchParams = new URLSearchParams(search);

  // eslint-disable-next-line camelcase
  const filters = useSelector(state =>
    getFiltersValuesByRecordType(state, recordType)
  );

  const permissions = useSelector(state =>
    getPermissionsByRecord(state, recordType)
  );

  const fetchRecords = getRecordsFetcherByType(recordType);

  const defaultFilters = fromJS({
    fields: "short",
    id_search: filters.id_search,
    query: filters.query,
    status: ["open"],
    record_state: ["true"]
  });

  const canSearchOthers =
    permissions.includes(ACTIONS.MANAGE) ||
    permissions.includes(ACTIONS.SEARCH_OWNED_BY_OTHERS);

  const listHeaders =
    // eslint-disable-next-line camelcase
    filters.id_search && canSearchOthers
      ? headers.filter(header => header.id_search)
      : headers;

  const indexTableProps = {
    recordType,
    defaultFilters,
    bypassInitialFetch: true,
    columns: buildTableColumns(listHeaders, i18n, recordType, css),
    onTableChange: fetchRecords,
    onRowClick: record => {
      const allowedToOpenRecord =
        record && typeof record.get("record_in_scope") !== "undefined"
          ? record.get("record_in_scope")
          : false;

      if (allowedToOpenRecord) {
        dispatch(push(`${recordType}/${record.get("id")}`));
      } else if (canViewModal) {
        setCurrentRecord(record);
        setOpenViewModal(true);
      }
    },
    selectedRecords,
    setSelectedRecords
  };

  const handleDrawer = () => {
    setDrawer(!drawer);
  };

  const filterContainerProps = {
    mobileDisplay,
    drawer,
    handleDrawer
  };

  const recordListToolbarProps = {
    title: i18n.t(`${recordType}.label`),
    recordType,
    handleDrawer,
    mobileDisplay,
    selectedRecords
  };

  const filterProps = {
    recordType,
    defaultFilters,
    fromDashboard: Boolean(searchParams.get("fromDashboard"))
  };

  return (
    <>
      <PageContainer>
        <Box className={css.content}>
          <Box className={css.tableContainer} flexGrow={1}>
            <RecordListToolbar {...recordListToolbarProps} />
            <Box className={css.table}>
              <IndexTable {...indexTableProps} />
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
