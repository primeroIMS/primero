import { IndexTable } from "components/index-table";
import { Filters } from "components/filters";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Map } from "immutable";
import { themeHelper } from "libs";
import { PageContainer } from "components/page-container";
import styles from "./styles.css";
import RecordListToolbar from "./RecordListToolbar";
import FilterContainer from "./FilterContainer";

const defaultFilters = Map({
  per: 20,
  page: 1
});

const RecordList = ({
  data,
  columns,
  title,
  loading,
  path,
  namespace,
  getRecords,
  recordType,
  primeroModule
}) => {
  const css = makeStyles(styles)();
  const { theme } = themeHelper();
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    getRecords({ options: data.filters.toJS(), path, namespace });
  }, []);

  const indexTableProps = {
    namespace,
    path,
    title,
    defaultFilters,
    columns,
    data,
    loading,
    recordType,
    onTableChange: getRecords
  };

  const handleDrawer = () => {
    setDrawer(!drawer);
  };

  const filterContainerProps = {
    mobileDisplay,
    drawer,
    handleDrawer
  };

  return (
    <PageContainer>
      <Box className={css.content}>
        <Box flexGrow={1}>
          <RecordListToolbar
            {...{
              recordType,
              title,
              primeroModule,
              handleDrawer,
              mobileDisplay
            }}
          />
          <Box className={css.table}>
            {!isEmpty(data.records) && <IndexTable {...indexTableProps} />}
          </Box>
        </Box>
        <FilterContainer {...filterContainerProps}>
          <Filters recordType={namespace} />
        </FilterContainer>
      </Box>
    </PageContainer>
  );
};

RecordList.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  columns: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
  getRecords: PropTypes.func.isRequired,
  recordType: PropTypes.string,
  primeroModule: PropTypes.string
};

export default RecordList;
