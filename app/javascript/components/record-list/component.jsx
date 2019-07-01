import { IndexTable } from "components/index-table";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/styles";
import styles from "./styles.css";

const defaultFilters = {
  per: 20,
  page: 1
};

const RecordList = ({
  data,
  columns,
  title,
  loading,
  path,
  namespace,
  getRecords,
  recordType
}) => {
  const css = makeStyles(styles)();

  useEffect(() => {
    getRecords({ options: data.filters, path, namespace });
  }, []);

  return (
    <Box className={css.root}>
      <Box className={css.table}>
        {!isEmpty(data.records) && (
          <IndexTable
            title={title}
            defaultFilters={defaultFilters}
            columns={columns}
            data={data}
            onTableChange={getRecords}
            loading={loading}
            recordType={recordType}
          />
        )}
      </Box>
      <Box className={css.filters}>Filters</Box>
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
  recordType: PropTypes.string
};

export default RecordList;
