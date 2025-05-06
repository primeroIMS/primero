// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { ButtonBase, Typography, TablePagination } from "@mui/material";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../i18n";
import { MAX_OFFLINE_ROWS_PER_PAGE, OFFLINE_ROWS_PER_PAGE_OPTIONS, ROWS_PER_PAGE_OPTIONS } from "../../../config";
import { useApp } from "../../application";

import css from "./styles.css";
import { NAME } from "./constants";
import { selectAllRecords } from "./utils";

function Component({
  canSelectAll = true,
  displayData,
  fetchRecords,
  page,
  perPage,
  recordType,
  selectedFilters,
  selectedRecords,
  selectedRows,
  setSelectedRecords,
  totalRecords
}) {
  const { online } = useApp();
  const rowsPerPage = perPage > MAX_OFFLINE_ROWS_PER_PAGE && !online ? MAX_OFFLINE_ROWS_PER_PAGE : perPage;
  const dispatch = useDispatch();
  const i18n = useI18n();
  const allRecordsSelected = Object.values(selectedRecords).flat()?.length === totalRecords && totalRecords > 0;
  const hasSelectedRows = !isEmpty(selectedRows?.data);
  const recordTypeLabel = Array.isArray(recordType) ? recordType.join(".") : recordType;

  const selectedRecordsMessage = i18n.t(`${recordTypeLabel}.selected_records`, {
    select_records: allRecordsSelected ? totalRecords : selectedRows?.data?.length
  });

  const selectAllMessage = allRecordsSelected
    ? i18n.t("buttons.clear_selection")
    : i18n.t(`${recordTypeLabel}.selected_all_records`, {
        total_records: totalRecords
      });

  const handleClick = () => {
    if (allRecordsSelected) {
      setSelectedRecords({});

      return;
    }
    setSelectedRecords(selectAllRecords(totalRecords, rowsPerPage));
  };

  const selectAllButton = selectedRows && selectedRows?.data?.length === displayData?.length && (
    <div className={css.customToolbarButton}>
      <ButtonBase id="select-all-button" className={css.selectAllButton} onClick={handleClick}>
        {selectAllMessage}
      </ButtonBase>
    </div>
  );
  const renderSelectedRecordMessage = (allRecordsSelected || hasSelectedRows) && (
    <div className={css.customToolbarTitle}>
      <Typography component="h6">{selectedRecordsMessage}</Typography>
    </div>
  );

  const onPageChange = (e, currentPage) => {
    dispatch(
      fetchRecords({
        recordType,
        data: selectedFilters.set("page", currentPage + 1)
      })
    );
  };

  const onRowsPerPageChange = ({ target }) => {
    dispatch(
      fetchRecords({
        recordType,
        data: selectedFilters.set("page", 1).set("per", target.value)
      })
    );
  };

  const handleLabelDisplayRow = ({ from, to, count }) => `${from}-${to} ${i18n.t("messages.record_list.of")} ${count}`;

  const rowsSelected = allRecordsSelected || hasSelectedRows;
  const paginationProps = {
    count: totalRecords,
    page: page - 1,
    rowsPerPage,
    rowsPerPageOptions: online ? ROWS_PER_PAGE_OPTIONS : OFFLINE_ROWS_PER_PAGE_OPTIONS,
    component: "div",
    onPageChange,
    className: css.customToolbarPagination,
    onRowsPerPageChange,
    labelRowsPerPage: i18n.t("messages.record_list.rows_per_page"),
    labelDisplayedRows: handleLabelDisplayRow
  };

  return (
    <div className={css.customToolbarFull}>
      <div className={css.firstGroup}>
        {rowsSelected ? (
          <>
            {renderSelectedRecordMessage}
            {canSelectAll && selectAllButton}
          </>
        ) : null}
      </div>
      <div className={css.lastGroup}>
        <TablePagination {...paginationProps} />
      </div>
    </div>
  );
}

Component.propTypes = {
  canSelectAll: PropTypes.bool,
  displayData: PropTypes.array,
  fetchRecords: PropTypes.func,
  page: PropTypes.number,
  perPage: PropTypes.number,
  recordType: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  selectedFilters: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  selectedRecords: PropTypes.object,
  selectedRows: PropTypes.object,
  setSelectedRecords: PropTypes.func,
  totalRecords: PropTypes.number
};

Component.displayName = NAME;

export default Component;
