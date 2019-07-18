import { IndexTable } from "components/index-table";
import { Filters } from "components/filters";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Map } from "immutable";
import styles from "./styles.css";
import RecordListToolbar from "./RecordListToolbar";
import { cleanUpFilters } from "./helpers";

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

  useEffect(() => {
    getRecords({
      options: cleanUpFilters(data.filters.toJS()),
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
    onTableChange: getRecords
  };

  return (
    <Box className={css.root}>
      <Box className={css.content}>
        <Box flexGrow={1}>
          <RecordListToolbar {...{ recordType, title, primeroModule }} />
          <Box className={css.table}>
            {!isEmpty(data.records) && <IndexTable {...indexTableProps} />}
          </Box>
        </Box>
        <Box mx={2}>
          <Filters recordType={namespace} />
        </Box>
      </Box>
    </Box>
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
