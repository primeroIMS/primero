// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useCallback, useEffect } from "react";
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
  const { register, unregister, setValue } = useFormContext();
  const { searchField, phoneError, handleInvalidNumber, phoneNumber } = useSearchBox();

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

  const handleToggleChange = useCallback(
    event => {
      const { value } = event.target;

      setValue(FIELD_NAME_ID_SEARCH, value === "id_search");
      setValue(PHONETIC_FIELD_NAME, value === "phonetic");

      // NOTE: Avoid invalid phone numbers when a user switches to phone number search
      if (value === "phone_number") {
        setValue(FIELD_NAME_QUERY, "");
        setValue(PHONE_NUMBER_FIELD_NAME, true);
      } else {
        setValue(PHONE_NUMBER_FIELD_NAME, false);
      }
    },
    [setValue]
  );

  return (
    <div className={cx({ [css.searchContainer]: !useFullWidth, [css.searchContainerFullWidth]: useFullWidth })}>
      {showFieldToggle && <p className={css.searchTitle}>{i18n.t("navigation.search_by")}</p>}
      {showFieldToggle && <SearchFieldToggle handleChange={handleToggleChange} value={searchField} />}
      <SearchTitle label={searchFieldLabel} searchField={searchField} />
      <div className={css.searchBoxContainer}>
        <SearchInput onInvalidNumber={handleInvalidNumber} phoneNumber={phoneNumber} />
        <SearchActions showSearchButton={showSearchButton} />
      </div>
      {phoneError && phoneNumber && (
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
