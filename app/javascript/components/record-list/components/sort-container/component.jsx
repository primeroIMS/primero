import { Drawer, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { fromJS } from "immutable";
import PropTypes from "prop-types";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import { useMemoizedSelector } from "../../../../libs";
import { useI18n } from "../../../i18n";
import { getFilters } from "../../../index-table";

import css from "./styles.css";

const SortContainer = ({ columns, open, onClose, recordType, applyFilters }) => {
  const filters = useMemoizedSelector(state => getFilters(state, recordType));
  const dispatch = useDispatch();
  const i18n = useI18n();
  const tableColumns = columns();

  const sortableColumns =
    tableColumns.filter(
      column => column.sort !== false && column.options.sort !== false && column.options.display !== false
    ) || fromJS([]);

  const onChange = data => {
    const { value } = data.target;
    const orderBy = value.replace("_asc", "").replace("_desc", "");
    const order = value.replace(`${orderBy}_`, "");

    onClose();
    dispatch(applyFilters({ recordType, data: filters.merge(fromJS({ order, order_by: orderBy })) }));
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} onChange={onChange}>
      <div className={css.sortContainer}>
        <h3 className={css.sortByTitle}>Sort by</h3>
        <RadioGroup
          defaultValue={`${filters.get("order_by")}_${filters.get("order")}`}
          aria-label="gender"
          name="order_by"
        >
          {sortableColumns.map(column => (
            <>
              <div className={css.sortableColumn}>
                <div className={css.sortField}>
                  <FormControlLabel
                    value={`${column.name}_asc`}
                    control={<Radio />}
                    label={column.label?.trim() || i18n.t(`${recordType}.${column.name}`)}
                  />
                </div>
                <div className={css.sortDir}>
                  <ArrowUpwardIcon />
                </div>
              </div>
              <div className={css.sortableColumn}>
                <div className={css.sortField}>
                  <FormControlLabel
                    value={`${column.name}_desc`}
                    control={<Radio />}
                    label={column.label?.trim() || i18n.t(`${recordType}.${column.name}`)}
                  />
                </div>
                <div className={css.sortDir}>
                  <ArrowDownwardIcon />
                </div>
              </div>
            </>
          ))}
        </RadioGroup>
      </div>
    </Drawer>
  );
};

SortContainer.displayName = "SortContainer";

SortContainer.propTypes = {
  applyFilters: PropTypes.func.isRequired,
  columns: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  recordType: PropTypes.string.isRequired
};

export default SortContainer;
