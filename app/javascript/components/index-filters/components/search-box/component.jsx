import PropTypes from "prop-types";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { cx } from "@emotion/css";

import { useI18n } from "../../../i18n";

import SearchHelpText from "./search-help-text";
import SearchFieldToggle from "./search-field-toggle";
import SearchInput from "./search-input";
import SearchTitle from "./search-title";
import css from "./styles.css";
import useSearchBox from "./use-search-box";
import SearchActions from "./search-actions";
import { FIELD_NAME_ID_SEARCH, FIELD_NAME_QUERY, PHONE_NUMBER_FIELD_NAME, PHONETIC_FIELD_NAME } from "./constants";

function SearchBox({
  showSearchButton = true,
  useFullWidth = false,
  searchFieldLabel,
  showFieldToggle = true,
  recordType = ""
}) {
  const i18n = useI18n();
  const { control, register, unregister, setValue } = useFormContext();
  const { searchField, phoneError, handleInvalidNumber, isPhoneNumber, handleToggleChange } = useSearchBox({
    control,
    setValue
  });

  useEffect(() => {
    register({ name: FIELD_NAME_ID_SEARCH });
    register({ name: PHONETIC_FIELD_NAME });
    register({ name: PHONE_NUMBER_FIELD_NAME });

    return () => {
      unregister(FIELD_NAME_QUERY);
      unregister(FIELD_NAME_ID_SEARCH);
      unregister(PHONETIC_FIELD_NAME);
      unregister(PHONE_NUMBER_FIELD_NAME);
    };
  }, [register, unregister]);

  return (
    <div className={cx({ [css.searchContainer]: !useFullWidth, [css.searchContainerFullWidth]: useFullWidth })}>
      {showFieldToggle && <p className={css.searchTitle}>{i18n.t("navigation.search_by")}</p>}
      {showFieldToggle && <SearchFieldToggle handleChange={handleToggleChange} value={searchField} />}
      <SearchTitle label={searchFieldLabel} searchField={searchField} />
      <div className={css.searchBoxContainer}>
        <SearchInput
          formMethods={{ control, setValue }}
          onInvalidNumber={handleInvalidNumber}
          isPhoneNumber={isPhoneNumber}
        />
        <SearchActions showSearchButton={showSearchButton} />
      </div>
      {phoneError && isPhoneNumber && (
        <p className={css.phoneNumberError}>{i18n.t("navigation.phone_number_search.warning_text")}</p>
      )}
      {showFieldToggle && <SearchHelpText recordType={recordType} searchField={searchField} />}
    </div>
  );
}

SearchBox.displayName = "SearchBox";

SearchBox.propTypes = {
  recordType: PropTypes.string,
  searchFieldLabel: PropTypes.string,
  showFieldToggle: PropTypes.bool,
  showSearchButton: PropTypes.bool,
  useFullWidth: PropTypes.bool
};

export default SearchBox;
