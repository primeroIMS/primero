// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { useDispatch } from "react-redux";

import { useI18n } from "../../../i18n";
import FiltersForm from "../filters-form";
// eslint-disable-next-line import/no-named-as-default
import useFormFilters from "../../use-form-filters";
import { fetchAccessLogs } from "../../../access-logs/action-creators";

import { FILTER_NAMES, NAME } from "./constants";
import { getFilters, onSubmitFn } from "./utils";

function Component({ selectedForm, formMode, recordId, recordType, showDrawer }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { setFormFilters, selectedFilters } = useFormFilters(selectedForm);

  const filters = getFilters(i18n);

  const handleSubmit = data =>
    onSubmitFn({ filters: data, dispatch, fetchFn: fetchAccessLogs, setFormFilters, recordId, recordType });

  const initialFilters = {
    [FILTER_NAMES.field_names]: (selectedFilters.get(FILTER_NAMES.field_names) || fromJS([])).reduce(
      (acc, elem) => [...acc, elem],
      []
    ),
    [FILTER_NAMES.form_unique_ids]: (selectedFilters.get(FILTER_NAMES.form_unique_ids) || fromJS([])).reduce(
      (acc, elem) => [...acc, elem],
      []
    )
  };

  return (
    !formMode.isNew && (
      <FiltersForm
        clearFields={[FILTER_NAMES.form_unique_ids, FILTER_NAMES.field_names]}
        filters={filters}
        onSubmit={handleSubmit}
        initialFilters={initialFilters}
        showDrawer={showDrawer}
        closeDrawerOnSubmit
      />
    )
  );
}

Component.displayName = NAME;

Component.propTypes = {
  formMode: PropTypes.object,
  recordId: PropTypes.string,
  recordType: PropTypes.string,
  selectedForm: PropTypes.string,
  showDrawer: PropTypes.bool
};

export default Component;
