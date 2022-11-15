import { useCallback } from "react";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import FilterApplied from "../filter-applied";

import { NAME } from "./constants";

const Component = ({
  constraints,
  handleOpenModal,
  handleEdit,
  indexes,
  isConditionsList = false,
  showEmptyMessage = true
}) => {
  const i18n = useI18n();

  const handleClickOpen = useCallback((index, filter) => () => handleOpenModal(index, filter), []);
  const handleClickEdit = useCallback((index, filter) => () => handleEdit(index, filter), []);

  if (isEmpty(indexes) && showEmptyMessage) {
    return <p>{i18n.t("report.no_filters_added")}</p>;
  }

  const conditionTypes = isConditionsList ? indexes.map(current => current.data.type).filter(type => !isNil(type)) : [];

  return Object.entries(indexes).map((filter, index) => (
    <FilterApplied
      constraints={constraints}
      key={filter.index}
      filter={filter}
      deleteDisabled={isConditionsList && index === 0 && indexes.length > 1}
      conditionTypes={conditionTypes}
      handleClickOpen={handleClickOpen}
      handleClickEdit={handleClickEdit}
    />
  ));
};

Component.displayName = NAME;

Component.propTypes = {
  constraints: PropTypes.object,
  handleEdit: PropTypes.func,
  handleOpenModal: PropTypes.func,
  indexes: PropTypes.array,
  isConditionsList: PropTypes.bool,
  showEmptyMessage: PropTypes.bool
};

export default Component;
