import { useCallback } from "react";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import FilterApplied from "../filter-applied";

import { NAME } from "./constants";

const Component = ({ handleOpenModal, handleEdit, indexes }) => {
  const i18n = useI18n();

  const handleClickOpen = useCallback((index, filter) => () => handleOpenModal(index, filter), []);
  const handleClickEdit = useCallback((index, filter) => () => handleEdit(index, filter), []);

  if (isEmpty(indexes)) {
    return <p>{i18n.t("report.no_filters_added")}</p>;
  }

  return Object.entries(indexes).map(filter => (
    <FilterApplied
      key={filter.index}
      filter={filter}
      handleClickOpen={handleClickOpen}
      handleClickEdit={handleClickEdit}
    />
  ));
};

Component.displayName = NAME;

Component.propTypes = {
  handleEdit: PropTypes.func,
  handleOpenModal: PropTypes.func,
  indexes: PropTypes.array
};

export default Component;
