import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { ButtonBase, Typography, TablePagination } from "@material-ui/core";

import { useI18n } from "../../i18n";
import { ROWS_PER_PAGE_OPTIONS } from "../../../config/constants";

import styles from "./styles.css";
import { NAME } from "./constants";
import { selectAllRecords } from "./utils";

const useStyles = makeStyles(styles);

const Component = ({
  canSelectAll,
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
}) => {
  const css = useStyles();
  const dispatch = useDispatch();
  const i18n = useI18n();

  const allRecordsSelected = Object.values(selectedRecords).flat()?.length === totalRecords;

  const recordTypeLabel = Array.isArray(recordType) ? recordType.join(".") : recordType;

  const selectedRecordsMessage = i18n.t(`${recordTypeLabel}.selected_records`, {
    select_records: allRecordsSelected ? totalRecords : selectedRows?.data.length
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
    setSelectedRecords(selectAllRecords(totalRecords, perPage));
  };

  const selectAllButton = selectedRows && selectedRows.data.length === displayData?.length && (
    <div className={css.customToolbarButton}>
      <ButtonBase className={css.selectAllButton} onClick={handleClick}>
        {selectAllMessage}
      </ButtonBase>
    </div>
  );

  const renderSelectedRecordMessage = (allRecordsSelected || selectedRows?.data.length) && (
    <div className={css.customToolbarTitle}>
      <Typography component="h6">{selectedRecordsMessage}</Typography>
    </div>
  );

  const onChangePage = (e, currentPage) => {
    dispatch(
      fetchRecords({
        recordType,
        data: selectedFilters.set("page", currentPage + 1)
      })
    );
  };

  const onChangeRowsPerPage = ({ target }) =>
    dispatch(
      fetchRecords({
        recordType,
        data: selectedFilters.set("page", 1).set("per", target.value)
      })
    );

  const handleLabelDisplayRow = ({ from, to, count }) => `${from}-${to} ${i18n.t("messages.record_list.of")} ${count}`;

  const paginationProps = {
    count: totalRecords,
    page: page - 1,
    rowsPerPage: perPage,
    rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
    component: "div",
    onChangePage,
    className: css.customToolbarPagination,
    onChangeRowsPerPage,
    labelRowsPerPage: i18n.t("messages.record_list.rows_per_page"),
    labelDisplayedRows: handleLabelDisplayRow
  };

  return (
    <div className={css.customToolbarFull}>
      <div className={css.firstGroup}>
        {renderSelectedRecordMessage}
        {canSelectAll && selectAllButton}
      </div>
      <div className={css.lastGroup}>
        <TablePagination {...paginationProps} />
      </div>
    </div>
  );
};

Component.defaultProps = {
  canSelectAll: true
};

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
