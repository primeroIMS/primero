// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import { useI18n } from "../../../i18n";

import css from "./styles.css";

function Component({ searchField, searchFieldTooltips = [] }) {
  const i18n = useI18n();
  const tooltipTitleHeader =
    searchField === "phonetic"
      ? i18n.t("navigation.phonetic_search.tooltip_label")
      : i18n.t("navigation.id_search.tooltip_label");

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
