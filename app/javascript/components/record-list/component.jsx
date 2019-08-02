import { IndexTable } from "components/index-table";
import { Filters } from "components/filters";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Map } from "immutable";
import { themeHelper } from "libs";
import { RecordSearch } from "components/record-search";
import { PageContainer } from "components/page-container";
import { withRouter } from "react-router-dom";
import { LoadingIndicator } from "components/loading-indicator";
import { useSelector } from "react-redux";
import styles from "./styles.css";
import RecordListToolbar from "./RecordListToolbar";
import FilterContainer from "./FilterContainer";
import { selectErrors } from "./selectors";

const defaultFilters = Map({
  per: 20,
  page: 0
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
  primeroModule,
  history
}) => {
  const css = makeStyles(styles)();
  const { theme } = themeHelper({});
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    getRecords({
      options: data.filters.toJS(),
      path,
      namespace
    });
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
    onTableChange: getRecords,
    onRowClick: (rowData, rowMeta) => {
      history.push(`${path}/${data.records.getIn([rowMeta.dataIndex, "id"])}`);
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
    namespace,
    path,
    data,
    getRecords
  };

  const errors = useSelector(state => selectErrors(state, namespace));

  return (
    <PageContainer>
      <Box className={css.content}>
        <Box className={css.tableContainer} flexGrow={1}>
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
            <LoadingIndicator
              loading={loading}
              hasData={data.records.size > 0}
              type={recordType}
              errors={errors}
            >
              <IndexTable {...indexTableProps} />
            </LoadingIndicator>
          </Box>
        </Box>
        <FilterContainer {...filterContainerProps}>
          <RecordSearch {...recordSearchProps} />
          <Filters recordType={namespace} />
        </FilterContainer>
      </Box>
    </PageContainer>
  );
};

RecordList.propTypes = {
  history: PropTypes.object.isRequired,
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

export default withRouter(RecordList);
