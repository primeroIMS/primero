// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import { useI18n } from "../../../i18n";

import css from "./styles.css";

const TOOLTIP_HEADER_I18N_KEY = {
  id_search: "navigation.id_search.tooltip_label",
  phonetic: "navigation.phonetic_search.tooltip_label",
  phone_number: "navigation.phone_number_search.tooltip_label"
};

function Component({ searchField, searchFieldTooltips = [] }) {
  const i18n = useI18n();
  const tooltipTitleHeader = i18n.t(TOOLTIP_HEADER_I18N_KEY[searchField]);

  if (isEmpty(searchFieldTooltips)) {
    return null;
  }

  return (
    <div>
      <div>{tooltipTitleHeader}</div>
      <ul className={css.list}>
        {searchFieldTooltips.map(fieldDisplayName => {
          return <li key={fieldDisplayName}>{fieldDisplayName}</li>;
        })}
      </ul>
    </div>
  );
}

Component.displayName = "ToogleTooltip";

Component.propTypes = {
  searchField: PropTypes.string,
  searchFieldTooltips: PropTypes.array
};

export default Component;
