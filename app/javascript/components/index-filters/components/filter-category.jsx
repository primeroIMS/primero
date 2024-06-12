// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import SelectInput from "../../form/fields/select-input";
import { useI18n } from "../../i18n";
import { FILTER_CATEGORY } from "../constants";

import css from "./styles.css";

const FilterCategory = ({ formMethods }) => {
  const i18n = useI18n();
  const options = Object.values(FILTER_CATEGORY).map(
    elem => ({
      id: elem,
      display_text: i18n.t(`filters.categories.${elem}`)
    }),
    []
  );

  return (
    <div className={css.filterCategory} data-testid="filter-category">
      <SelectInput
        options={options}
        commonInputProps={{
          InputLabelProps: { shrink: true },
          label: i18n.t("incidents.filter_by.filter_category"),
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
