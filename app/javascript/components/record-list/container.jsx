import { IndexTable } from "components/index-table";
import { Filters } from "components/filters";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Map } from "immutable";
import { useThemeHelper } from "libs";
import { RecordSearch } from "components/record-search";
import { PageContainer } from "components/page";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "components/i18n";
import { fetchRecords } from "components/records";
import { selectFiltersByRecordType } from "components/filters-builder";
import { getPermissionsByRecord } from "components/user";
import { PERMISSIONS } from "config";
import RecordListToolbar from "./RecordListToolbar";
import FilterContainer from "./FilterContainer";
import { selectListHeaders } from "./selectors";
import { buildTableColumns, setFilters } from "./helpers";
import styles from "./styles.css";

const RecordList = ({ match }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const { theme } = useThemeHelper({});
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawer, setDrawer] = useState(false);
  const { params, url } = match;
  const { recordType } = params;
  const dispatch = useDispatch();
  const headers = useSelector(state => selectListHeaders(state, recordType));

  // eslint-disable-next-line camelcase
  const { id_search, query } = useSelector(state =>
    selectFiltersByRecordType(state, recordType)
  );

  const permissions = useSelector(state =>
    getPermissionsByRecord(state, recordType)
  );

  useEffect(() => {
    dispatch(setFilters(recordType, { id_search: false, query: "" }));
  }, [url]);

  const canSearchOthers =
    permissions.includes(PERMISSIONS.MANAGE) ||
    permissions.includes(PERMISSIONS.SEARCH_OWNED_BY_OTHERS);

  const listHeaders =
    // eslint-disable-next-line camelcase
    id_search && canSearchOthers
      ? headers.filter(header => header.id_search)
      : headers;

  const defaultFilters = Map({
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

  const indexTableProps = {
    recordType,
    defaultFilters,
    columns: buildTableColumns(listHeaders, i18n, recordType),
    onTableChange: fetchRecords
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
  );
};

RecordList.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(RecordList);
