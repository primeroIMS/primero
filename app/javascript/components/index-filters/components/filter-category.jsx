import PropTypes from "prop-types";

import SelectInput from "../../form/fields/select-input";
import { useI18n } from "../../i18n";

import css from "./styles.css";

const FilterCategory = ({ formMethods }) => {
  const i18n = useI18n();
  const options = [
    { id: "incidents", display_text: i18n.t("filters.categories.violations") },
    { id: "individual_victims", display_text: i18n.t("filters.categories.individual_victims") }
  ];

  return (
    <div className={css.filterCategory}>
      <SelectInput
        options={options}
        commonInputProps={{
          InputLabelProps: { shrink: true },
          label: "Filter Category",
          name: "filter_category",
          id: "filter_category"
        }}
        metaInputProps={{ disableClearable: true }}
        formMethods={formMethods}
      />
    </div>
  );
};

FilterCategory.displayName = "FilterCategory";

FilterCategory.propTypes = {
  formMethods: PropTypes.object
};

export default FilterCategory;
