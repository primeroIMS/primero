// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { useI18n } from "../../../i18n";
import FiltersForm from "../filters-form";
// eslint-disable-next-line import/no-named-as-default
import useFormFilters from "../../use-form-filters";
import { fetchAccessLogs } from "../../../access-logs/action-creators";

import { FILTER_NAMES, NAME, ACTIONS } from "./constants";
import { getFilters, onSubmitFn, defaultDateValues } from "./utils";

function Component({ selectedForm, formMode, recordId, recordType, showDrawer }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { setFormFilters } = useFormFilters(selectedForm);

  const filters = getFilters(i18n);

  const handleSubmit = data =>
    onSubmitFn({ filters: data, dispatch, fetchFn: fetchAccessLogs, setFormFilters, recordId, recordType });

  const initialFilters = {
    [FILTER_NAMES.actions]: ACTIONS,
    [FILTER_NAMES.timestamp]: defaultDateValues()
  };

  return (
    !formMode.isNew && (
      <FiltersForm
        clearFields={[FILTER_NAMES.actions, FILTER_NAMES.timestamp]}
        filters={filters}
        onSubmit={handleSubmit}
        showDrawer={showDrawer}
        initialFilters={initialFilters}
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
