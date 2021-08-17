import isEmpty from "lodash/isEmpty";
import last from "lodash/last";
import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import FilterApplied from "../filter-applied";

import { getOptionSources } from "./utils";
import { NAME } from "./constants";

const Component = ({ fields, handleOpenModal, handleEdit, indexes }) => {
  const i18n = useI18n();

  const optionSources = getOptionSources(fields);

  if (isEmpty(indexes)) {
    return <p>{i18n.t("report.no_filters_added")}</p>;
  }

  const handleClickOpen = index => () => handleOpenModal(index);
  const handleClickEdit = index => () => handleEdit(index);

  return Object.entries(indexes).map(filter => {
    const { attribute } = last(filter).data;
    const field = fields.find(f => f.id === attribute);

    if (!field) return false;

    return (
      <FilterApplied
        filter={filter}
        field={field}
        optionSources={optionSources}
        handleClickOpen={handleClickOpen}
        handleClickEdit={handleClickEdit}
      />
    );
  });
};

Component.displayName = NAME;

Component.propTypes = {
  fields: PropTypes.object
};

export default Component;
