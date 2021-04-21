import PropTypes from "prop-types";
import { fromJS } from "immutable";

import { useMemoizedSelector } from "../../../../libs";
import { useI18n } from "../../../i18n";
import { getRecordForms } from "../../../record-form";
import FiltersForm from "../filters-form";
// eslint-disable-next-line import/no-named-as-default
import useFormFilters from "../../use-form-filters";

import { FILTER_NAMES, NAME } from "./constants";
import { getFilters } from "./utils";

const Component = ({ selectedForm, formMode, primeroModule, recordType, showDrawer }) => {
  const i18n = useI18n();
  const { setFormFilters, selectedFilters } = useFormFilters(selectedForm);

  const forms = useMemoizedSelector(state => getRecordForms(state, { recordType, primeroModule }));

  const filters = getFilters(forms, i18n);

  const handleSubmit = data => setFormFilters(data);

  const initialFilters = {
    [FILTER_NAMES.field_names]: selectedFilters
      .get(FILTER_NAMES.field_names, fromJS([]))
      .reduce((acc, elem) => [...acc, elem], []),
    [FILTER_NAMES.form_unique_ids]: selectedFilters
      .get(FILTER_NAMES.form_unique_ids, fromJS([]))
      .reduce((acc, elem) => [...acc, elem], [])
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
};

Component.displayName = NAME;

Component.propTypes = {
  formMode: PropTypes.object,
  primeroModule: PropTypes.string,
  recordType: PropTypes.string,
  selectedForm: PropTypes.string,
  showDrawer: PropTypes.bool
};

export default Component;
