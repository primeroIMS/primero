import PropTypes from "prop-types";
import { memo } from "react";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../i18n";

import css from "./styles.css";

const SEARCH_TITLE_I18N_KEY = {
  id_search: "navigation.id_search.title",
  phonetic: "navigation.phonetic_search.title",
  phone_number: "navigation.phone_number_search.title"
};

function Component({ label, searchField = "id_search" }) {
  const i18n = useI18n();
  const titleI18nKey = SEARCH_TITLE_I18N_KEY[searchField];
  const title = isEmpty(label) ? i18n.t(titleI18nKey) : label;

  return <p className={css.searchLabel}>{title}</p>;
}

Component.displayName = "SearchTitle";

Component.propTypes = {
  label: PropTypes.string.isRequired,
  searchField: PropTypes.string.isRequired
};

export default memo(Component);
