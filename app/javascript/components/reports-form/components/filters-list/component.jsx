import { useCallback } from "react";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import FilterApplied from "../filter-applied";

import { NAME } from "./constants";

const Component = ({
  constraints,
  disablesDelete = false,
  handleOpenModal,
  handleEdit,
  indexes,
  showEmptyMessage = true
}) => {
  const i18n = useI18n();

  const handleClickOpen = useCallback((index, filter) => () => handleOpenModal(index, filter), []);
  const handleClickEdit = useCallback((index, filter) => () => handleEdit(index, filter), []);

  if (isEmpty(indexes) && showEmptyMessage) {
    return <p>{i18n.t("report.no_filters_added")}</p>;
  }

  return Object.entries(indexes).map((filter, index) => (
    <FilterApplied
      constraints={constraints}
      key={filter.index}
      filter={filter}
      deleteDisabled={disablesDelete && index === 0 && indexes.length > 1}
      handleClickOpen={handleClickOpen}
      handleClickEdit={handleClickEdit}
    />
  ));
};

Component.displayName = NAME;

Component.propTypes = {
  constraints: PropTypes.object,
  disablesDelete: PropTypes.bool,
  handleEdit: PropTypes.func,
  handleOpenModal: PropTypes.func,
  indexes: PropTypes.array,
  showEmptyMessage: PropTypes.bool
};

export default Component;
