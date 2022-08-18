import { useCallback } from "react";
import { Drawer } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { fromJS } from "immutable";
import PropTypes from "prop-types";

import { useMemoizedSelector } from "../../../../libs";
import { useI18n } from "../../../i18n";
import { getFilters } from "../../../index-table";

import SortableColumns from "./sortable-columns";
import css from "./styles.css";

const EXCLUDED_COLUMNS = Object.freeze(["case_id_display"]);

function SortContainer({ columns, open, onClose, recordType, applyFilters }) {
  const filters = useMemoizedSelector(state => getFilters(state, recordType));
  const dispatch = useDispatch();
  const i18n = useI18n();
  const tableColumns = columns();

  const sortableColumns =
    tableColumns.filter(
      column =>
        column.sort !== false &&
        column.options.sort !== false &&
        column.options.display !== false &&
        !EXCLUDED_COLUMNS.includes(column.name)
    ) || fromJS([]);

  const onChange = useCallback(
    data => {
      const { value } = data.target;
      const orderBy = value.replace("_asc", "").replace("_desc", "");
      const order = value.replace(`${orderBy}_`, "");

      onClose();
      dispatch(applyFilters({ recordType, data: filters.merge(fromJS({ order, order_by: orderBy })) }));
    },
    [open, recordType, filters]
  );

  return (
    <Drawer anchor="right" open={open} onClose={onClose} onChange={onChange}>
      <div className={css.sortContainer}>
        <h3 className={css.sortByTitle}>{i18n.t(`${recordType}.sort_by`)}</h3>
        <SortableColumns filters={filters} sortableColumns={sortableColumns} recordType={recordType} />
      </div>
    </Drawer>
  );
}

SortContainer.displayName = "SortContainer";

SortContainer.propTypes = {
  applyFilters: PropTypes.func.isRequired,
  columns: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  recordType: PropTypes.string.isRequired
};

export default SortContainer;
