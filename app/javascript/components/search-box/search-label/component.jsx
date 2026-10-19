import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { InputLabel } from "@mui/material";

import { useI18n } from "../../i18n";

import css from "./styles.css";

const SEARCH_TITLE_I18N_KEY = {
  id_search: "navigation.id_search.title",
  phonetic: "navigation.phonetic_search.title",
  phone_number: "navigation.phone_number_search.title"
};

function Component({ label, searchField = "id_search", htmlFor, required = false }) {
  const i18n = useI18n();
  const titleI18nKey = SEARCH_TITLE_I18N_KEY[searchField];
  const title = isEmpty(label) ? i18n.t(titleI18nKey) : label;

  return (
    <InputLabel shrink htmlFor={htmlFor} className={css.searchLabel} required={required}>
      {title}
    </InputLabel>
  );
}

Component.displayName = "SearchLabel";

Component.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  searchField: PropTypes.string.isRequired
};

export default Component;
