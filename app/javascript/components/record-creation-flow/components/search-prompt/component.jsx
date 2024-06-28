// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { InputLabel, FormHelperText } from "@material-ui/core";
import isEmpty from "lodash/isEmpty";

import FormSection from "../../../form/components/form-section";
import { submitHandler, whichFormMode } from "../../../form";
import { FORM_MODE_NEW } from "../../../form/constants";
import { useMemoizedSelector } from "../../../../libs";
import { getRecordsData } from "../../../index-table";
import SearchNameToggle from "../../../index-filters/components/search-name-toggle";
import PhoneticHelpText from "../../../index-filters/components/phonetic-help-text";
import SearchButton from "../search-button";

import { NAME, FORM_ID, QUERY, PHONETIC_FIELD_NAME } from "./constants";
import { searchPromptForm } from "./forms";
import css from "./styles.css";

const Component = ({
  i18n,
  onCloseDrawer,
  recordType,
  setOpenConsentPrompt,
  setSearchValue,
  goToNewCase,
  dataProtectionFields,
  onSearchCases,
  openConsentPrompt
}) => {
  const formMode = whichFormMode(FORM_MODE_NEW);
  const dispatch = useDispatch();
  const methods = useForm();

  const records = useMemoizedSelector(state => getRecordsData(state, recordType));

  const {
    control,
    formState: { dirtyFields, isSubmitted },
    handleSubmit,
    getValues,
    setValue,
    register
  } = methods;

  const phonetic = useWatch({ control, name: PHONETIC_FIELD_NAME, defaultValue: false });

  const onSuccess = data => {
    submitHandler({
      data,
      dispatch,
      dirtyFields,
      formMode,
      i18n,
      initialValues: {},
      onSubmit: formData => {
        onSearchCases(formData);
      }
    });
  };

  const handleSwitchChange = event => {
    setValue(PHONETIC_FIELD_NAME, event.target.checked, { shouldDirty: true });
  };

  useEffect(() => {
    register(PHONETIC_FIELD_NAME);
  }, [register]);

  useEffect(() => {
    setValue(PHONETIC_FIELD_NAME, false);
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      if (records.size > 0) {
        onCloseDrawer();
      } else if (isEmpty(dataProtectionFields)) {
        goToNewCase();
      } else {
        setSearchValue(getValues()[QUERY]);
        setOpenConsentPrompt(true);
      }
    }
  }, [records]);

  if (openConsentPrompt) {
    return null;
  }

  return (
    <div className={css.search}>
      <div className={css.searchPromptFormContainer}>
        <div className={css.searchBox}>
          <InputLabel shrink htmlFor={QUERY} className={css.inputLabel} required>
            {i18n.t("case.enter_id_number")}
          </InputLabel>
          <div className={css.container}>
            <form id={FORM_ID} onSubmit={handleSubmit(onSuccess)}>
              {searchPromptForm(i18n).map(formSection => (
                <FormSection
                  formSection={formSection}
                  key={formSection.unique_id}
                  formMode={formMode}
                  formMethods={methods}
                  disableUnderline
                />
              ))}
            </form>
            <div className={css.searchButton}>
              <SearchButton formId={FORM_ID} />
            </div>
          </div>
          <FormHelperText>{i18n.t("case.search_helper_text")}</FormHelperText>
        </div>
        <div className={css.searchToggle}>
          <SearchNameToggle value={phonetic} handleChange={handleSwitchChange} />
          <div className={css.searchButton}>
            <SearchButton formId={FORM_ID} />
          </div>
        </div>
      </div>
      {phonetic && (
        <div className={css.phoneticHelpText}>
          <PhoneticHelpText />
        </div>
      )}
    </div>
  );
};

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
