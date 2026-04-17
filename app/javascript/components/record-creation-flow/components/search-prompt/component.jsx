// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import PropTypes from "prop-types";
import { InputLabel, useMediaQuery } from "@mui/material";
import { useForm } from "react-hook-form";
import isEmpty from "lodash/isEmpty";
import { cx } from "@emotion/css";

import { useMemoizedSelector } from "../../../../libs";
import { getRecordsData } from "../../../index-table";
import SearchHelpText from "../../../index-filters/components/search-box/search-help-text";
import SearchButton from "../search-button";
import SearchFieldToggle from "../../../index-filters/components/search-box/search-field-toggle";
import searchBoxCss from "../../../index-filters/components/search-box/styles.css";
import useSearchBox from "../../../index-filters/components/search-box/use-search-box";
import SearchInput from "../../../index-filters/components/search-box/search-input";
import useQueryParams from "../../../record-list/use-query-params";
import {
  FIELD_NAME_QUERY,
  PHONE_NUMBER_FIELD_NAME,
  PHONETIC_FIELD_NAME
} from "../../../index-filters/components/search-box/constants";

import { NAME, FORM_ID } from "./constants";
import css from "./styles.css";

function Component({
  i18n,
  onCloseDrawer,
  recordType,
  setOpenConsentPrompt,
  setSearchValue,
  goToNewCase,
  dataProtectionFields,
  onSearchCases,
  openConsentPrompt
}) {
  const { queryParams } = useQueryParams();
  const methods = useForm({
    defaultValues: {
      [FIELD_NAME_QUERY]: "",
      [PHONETIC_FIELD_NAME]: false,
      [PHONE_NUMBER_FIELD_NAME]: false
    }
  });
  const { searchField, phoneError, handleInvalidNumber, isPhoneNumber, handleToggleChange } = useSearchBox({
    control: methods.control,
    setValue: methods.setValue
  });
  const records = useMemoizedSelector(state => getRecordsData(state, recordType));
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));

  const {
    formState: { isSubmitted },
    handleSubmit,
    getValues,
    setValue,
    register,
    unregister
  } = methods;

  const classes = cx({
    [css.container]: true,
    [searchBoxCss.phoneNumberWarning]: !!phoneError
  });

  const placeholder = mobileDisplay ? i18n.t("navigation.search") : i18n.t("case.search_existing");

  const onSuccess = data => {
    onSearchCases(data);
  };

  useEffect(() => {
    register(PHONETIC_FIELD_NAME);
    register(PHONE_NUMBER_FIELD_NAME);

    return () => {
      unregister(PHONETIC_FIELD_NAME);
      unregister(PHONE_NUMBER_FIELD_NAME);
    };
  }, [register]);

  useEffect(() => {
    setValue(PHONETIC_FIELD_NAME, false);
    setValue(PHONE_NUMBER_FIELD_NAME, false);
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      if (records.size > 0) {
        onCloseDrawer();
      } else if (isEmpty(dataProtectionFields)) {
        goToNewCase();
      } else {
        setSearchValue(getValues()[FIELD_NAME_QUERY]);
        setOpenConsentPrompt(true);
      }
    }
  }, [records, isSubmitted, goToNewCase, setSearchValue, getValues, setOpenConsentPrompt, onCloseDrawer]);

  useEffect(() => {
    if (setValue && queryParams) {
      setValue(FIELD_NAME_QUERY, queryParams[FIELD_NAME_QUERY] || "");
      setValue(PHONETIC_FIELD_NAME, queryParams[PHONETIC_FIELD_NAME] || false);
      setValue(PHONE_NUMBER_FIELD_NAME, queryParams[PHONE_NUMBER_FIELD_NAME] || false);
    }
  }, [setValue, queryParams]);

  if (openConsentPrompt) {
    return null;
  }

  return (
    <form id={FORM_ID} onSubmit={handleSubmit(onSuccess)}>
      <div className={css.search}>
        <p className={css.searchPreventativeText}>{i18n.t("case.search_helper_text")}</p>
        <div className={css.searchToggle}>
          <p className={searchBoxCss.searchTitle}>{i18n.t("navigation.search_by")}</p>
          <SearchFieldToggle handleChange={handleToggleChange} value={searchField} />
        </div>
        <InputLabel shrink htmlFor={FIELD_NAME_QUERY} className={css.inputLabel} required>
          {i18n.t("case.enter_id_number")}
        </InputLabel>
        <div className={css.searchBox}>
          <div className={classes}>
            <SearchInput
              placeholder={placeholder}
              formMethods={methods}
              onInvalidNumber={handleInvalidNumber}
              isPhoneNumber={isPhoneNumber}
              showInputBorder={false}
            />
            <div className={css.searchButton}>
              <SearchButton formId={FORM_ID} />
            </div>
          </div>
          {mobileDisplay && (
            <div className={css.mobileSearchButton}>
              <SearchButton formId={FORM_ID} />
            </div>
          )}
        </div>
        {phoneError && isPhoneNumber && (
          <p className={searchBoxCss.phoneNumberError}>{i18n.t("navigation.phone_number_search.warning_text")}</p>
        )}
        <div className={css.searchHelpText}>
          <SearchHelpText searchField={searchField} recordType={recordType} />
        </div>
      </div>
    </form>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  dataProtectionFields: PropTypes.array,
  goToNewCase: PropTypes.func,
  i18n: PropTypes.object,
  onCloseDrawer: PropTypes.func,
  onSearchCases: PropTypes.func,
  openConsentPrompt: PropTypes.bool,
  recordType: PropTypes.string,
  setOpenConsentPrompt: PropTypes.func,
  setSearchValue: PropTypes.func
};

export default Component;
