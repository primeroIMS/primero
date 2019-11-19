import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { fromJS } from "immutable";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";

import IndexTable from "../index-table";
import Filters from "../filters";
import { RecordSearch } from "../record-search";
import { PageContainer } from "../page";
import { useI18n } from "../i18n";
import { getFiltersByRecordType } from "../filters-builder";
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
import {
  buildTableColumns,
  getFiltersSetterByType,
  getRecordsFetcherByType
} from "./helpers";
import RecordListToolbar from "./record-list-toolbar";
import { getListHeaders } from "./selectors";
import styles from "./styles.css";
import { ViewModal } from "./view-modal";

const Container = ({ match }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const { theme } = useThemeHelper({});
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawer, setDrawer] = useState(false);
  const { params, url } = match;
  const { recordType } = params;
  const dispatch = useDispatch();
  const headers = useSelector(state => getListHeaders(state, recordType));

  const [openViewModal, setOpenViewModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const userPermissions = useSelector(state =>
    getPermissionsByRecord(state, recordType)
  );

  const canViewModal = checkPermissions(userPermissions, [
    ACTIONS.DISPLAY_VIEW_PAGE
  ]);

  const handleViewModalClose = () => {
    setOpenViewModal(false);
  };

  // eslint-disable-next-line camelcase
  const { id_search, query } = useSelector(
    state => {
      const filters = getFiltersByRecordType(state, recordType);

      return { id_search: filters.id_search, query: filters.query };
    },
    (filters1, filters2) => {
      return (
        filters1.id_search === filters2.id_search &&
        filters1.query === filters2.query
      );
    }
  );

  const permissions = useSelector(state =>
    getPermissionsByRecord(state, recordType)
  );

  const setFilters = getFiltersSetterByType(recordType);

  const fetchRecords = getRecordsFetcherByType(recordType);

  const defaultFilters = fromJS({
    fields: "short",
    per: 20,
    page: 1,
    id_search,
    query,
    ...{
      ...(recordType === "cases"
        ? { status: ["open"], record_state: ["true"] }
        : {})
    },
    ...{
      ...(recordType === "incidents"
        ? { status: ["open"], record_state: ["true"] }
        : {})
    },
    ...{
      ...(recordType === "tracing_requests"
        ? { status: ["open"], record_state: ["true"] }
        : {})
    }
  });

  useEffect(() => {
    dispatch(setFilters({ options: defaultFilters.toJS() }));

    return () => {
      dispatch(setFilters({ options: { id_search: null, query: "" } }));
    };
  }, [url]);

  const canSearchOthers =
    permissions.includes(ACTIONS.MANAGE) ||
    permissions.includes(ACTIONS.SEARCH_OWNED_BY_OTHERS);

  const listHeaders =
    // eslint-disable-next-line camelcase
    id_search && canSearchOthers
      ? headers.filter(header => header.id_search)
      : headers;

  const indexTableProps = {
    recordType,
    defaultFilters,
    columns: buildTableColumns(listHeaders, i18n, recordType),
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
    }
  };

  const handleDrawer = () => {
    setDrawer(!drawer);
  };

  const filterContainerProps = {
    mobileDisplay,
    drawer,
    handleDrawer
  };

  const recordSearchProps = {
    recordType,
    setFilters
  };

  const recordListToolbarProps = {
    title: i18n.t(`${recordType}.label`),
    recordType,
    handleDrawer,
    mobileDisplay
  };

  const filterProps = {
    recordType,
    defaultFilters
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
            <RecordSearch {...recordSearchProps} />
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
  match: PropTypes.object.isRequired
};

export default withRouter(Container);
