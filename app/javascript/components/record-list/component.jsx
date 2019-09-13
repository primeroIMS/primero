import { IndexTable } from "components/index-table";
import { Filters } from "components/filters";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Box, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Map } from "immutable";
import { useThemeHelper } from "libs";
import { RecordSearch } from "components/record-search";
import { PageContainer } from "components/page-container";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { useI18n } from "components/i18n";
import styles from "./styles.css";
import RecordListToolbar from "./RecordListToolbar";
import FilterContainer from "./FilterContainer";
import { selectListHeaders } from "./selectors";
import { buildTableColumns } from "./helpers";
import { fetchRecords } from "./action-creators";

const RecordList = ({ match }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const { theme } = useThemeHelper({});
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawer, setDrawer] = useState(false);
  const { params } = match;
  const { recordType } = params;
  const listHeaders = useSelector(state =>
    selectListHeaders(state, recordType)
  );

  const defaultFilters = Map({
    short: true,
    per: 20,
    page: 1,
    ...{
      ...(recordType === "cases"
        ? { child_status: ["open"], record_state: ["true"] }
        : {})
    },
    ...{
      ...(recordType === "incidents"
        ? { child_status: ["open"], record_state: ["true"] }
        : {})
    },
    ...{
      ...(recordType === "tracing_requests"
        ? { inquiry_status: ["open"], record_state: ["true"] }
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
    fetchRecords
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
