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
  fetchRecords,
  namespace
}) => {
  const css = makeStyles(styles)();

  useEffect(() => {
    fetchRecords({ options: data.filters, path, namespace });
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
            onTableChange={fetchRecords}
            loading={loading}
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
  fetchRecords: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired
};

export default RecordList;
