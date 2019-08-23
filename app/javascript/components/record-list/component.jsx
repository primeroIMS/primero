/* eslint-disable */
import { IndexTable } from "components/index-table";
import { Filters } from "components/filters";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Map } from "immutable";
import { useThemeHelper } from "libs";
import { RecordSearch } from "components/record-search";
import { PageContainer } from "components/page-container";
import { withRouter } from "react-router-dom";
import { LoadingIndicator } from "components/loading-indicator";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "components/i18n";
import styles from "./styles.css";
import RecordListToolbar from "./RecordListToolbar";
import FilterContainer from "./FilterContainer";
import { selectErrors, selectListHeaders } from "./selectors";
import { buildTableColumns } from "./helpers";
import { fetchRecords } from "./action-creators";

const RecordList = ({
  // data,
  // title,
  // loading,
  // path,
  // namespace,
  // recordType,
  // primeroModule,
  match
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const { theme } = useThemeHelper({});
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawer, setDrawer] = useState(false);
  const { params } = match;
  const recordType = params.recordType;
  const listHeaders = useSelector(state => selectListHeaders(state, recordType));

  const indexTableProps = {
    recordType,
    defaultFilters: Map({
      per: 20,
      page: 1,
      ...{ ...(recordType === "cases" ? { child_status: ["open"], record_state: true } : {}) },
      ...{
        ...(recordType === "incidents" ? { inquiry_status: ["open"], record_state: true } : {})
      },
      ...{ ...(recordType === "tracing_requests" ? { status: ["open"], record_state: true } : {}) }
    }),
    columns: buildTableColumns(listHeaders, i18n),
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
    // namespace,
    // path,
    // data,
    fetchRecords
  };

  return (
    <PageContainer>
      <Box className={css.content}>
        <Box className={css.tableContainer} flexGrow={1}>
          {/* <RecordListToolbar
            {...{
              recordType,
              title,
              primeroModule,
              handleDrawer,
              mobileDisplay
            }}
          /> */}
          <Box className={css.table}>
            <IndexTable {...indexTableProps} />
          </Box>
        </Box>
        {/* <FilterContainer {...filterContainerProps}>
          <RecordSearch {...recordSearchProps} />
          <Filters recordType={namespace} />
        </FilterContainer> */}
      </Box>
    </PageContainer>
  );
};

RecordList.propTypes = {
  match: PropTypes.object.isRequired
  // history: PropTypes.object.isRequired,
  // data: PropTypes.object.isRequired,
  // loading: PropTypes.bool,
  // title: PropTypes.string.isRequired,
  // path: PropTypes.string.isRequired,
  // namespace: PropTypes.string.isRequired
  // recordType: PropTypes.string,
  // primeroModule: PropTypes.string
};

export default withRouter(RecordList);
