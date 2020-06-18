import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { ButtonBase, Typography, TablePagination } from "@material-ui/core";

import { useI18n } from "../../i18n";

import styles from "./styles.css";
import { NAME } from "./constants";
import { selectAllRecords } from "./utils";

const Component = ({
  displayData,
  fetchRecords,
  page,
  perPage,
  recordType,
  rowsPerPageOptions,
  selectedFilters,
  selectedRecords,
  selectedRows,
  setSelectedRecords,
  totalRecords
}) => {
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const i18n = useI18n();

  const allRecordsSelected =
    Object.values(selectedRecords).flat()?.length === totalRecords;

  const selectedRecordsMessage = i18n.t(`${recordType}.selected_records`, {
    select_records: allRecordsSelected
      ? totalRecords
      : selectedRows?.data.length
  });

  const selectAllMessage = allRecordsSelected
    ? i18n.t("buttons.clear_selection")
    : i18n.t(`${recordType}.selected_all_records`, {
        total_records: totalRecords
      });

  const handleClick = () => {
    if (allRecordsSelected) {
      setSelectedRecords({});

      return;
    }
    setSelectedRecords(selectAllRecords(totalRecords, perPage));
  };

  const selectAllButton = selectedRows &&
    selectedRows.data.length === displayData?.length && (
      <div className={css.customToolbarAll}>
        <ButtonBase className={css.selectAllButton} onClick={handleClick}>
          {selectAllMessage}
        </ButtonBase>
      </div>
    );

  const renderSelectedRecordMessage = (allRecordsSelected ||
    selectedRows?.data.length) && (
    <div className={css.customToolbarTitle}>
      <Typography component="h6">{selectedRecordsMessage}</Typography>
    </div>
  );

  const paginationProps = {
    count: totalRecords,
    page: page - 1,
    rowsPerPage: perPage,
    rowsPerPageOptions,
    component: "div",
    onChangePage: (e, currentPage) => {
      dispatch(
        fetchRecords({
          recordType,
          data: { ...selectedFilters, page: currentPage + 1 }
        })
      );
    },
    className: css.customToolbarPagination,
    onChangeRowsPerPage: ({ target }) =>
      dispatch(
        fetchRecords({
          recordType,
          data: { ...selectedFilters, page: 1, per: target.value }
        })
      )
  };

  return (
    <div className={css.customToolbarFull}>
      {renderSelectedRecordMessage}
      {selectAllButton}
      <TablePagination {...paginationProps} />
    </div>
  );
};

Component.propTypes = {
  displayData: PropTypes.array,
  fetchRecords: PropTypes.func,
  page: PropTypes.number,
  perPage: PropTypes.number,
  recordType: PropTypes.string,
  rowsPerPageOptions: PropTypes.array,
  selectedFilters: PropTypes.object,
  selectedRecords: PropTypes.object,
  selectedRows: PropTypes.object,
  setSelectedRecords: PropTypes.func,
  totalRecords: PropTypes.number
};

Component.displayName = NAME;

export default Component;
