import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import SearchIcon from "@material-ui/icons/Search";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { InputLabel, FormHelperText } from "@material-ui/core";

import FormSection from "../../../form/components/form-section";
import { submitHandler, whichFormMode } from "../../../form";
import { FORM_MODE_NEW } from "../../../form/constants";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { DEFAULT_FILTERS } from "../../../record-list/constants";
import { applyFilters } from "../../../index-filters";
import { useMemoizedSelector } from "../../../../libs";
import { getRecordsData } from "../../../index-table";

import { NAME, FORM_ID, QUERY } from "./constants";
import { searchPromptForm } from "./forms";
import styles from "./styles.css";

const Component = ({ i18n, onCloseDrawer, recordType, setOpenConsentPrompt, setSearchValue }) => {
  const css = makeStyles(styles)();
  const formMode = whichFormMode(FORM_MODE_NEW);
  const dispatch = useDispatch();
  const methods = useForm();
  const records = useMemoizedSelector(state => getRecordsData(state, recordType));

  const {
    formState: { dirtyFields, isSubmitted },
    handleSubmit,
    getValues
  } = methods;

  const onSuccess = data => {
    submitHandler({
      data,
      dispatch,
      dirtyFields,
      formMode,
      i18n,
      initialValues: {},
      onSubmit: formData => {
        dispatch(
          applyFilters({
            recordType,
            data: { ...DEFAULT_FILTERS, ...formData, id_search: true }
          })
        );
      }
    });
  };

  useEffect(() => {
    if (isSubmitted) {
      if (records.size > 0) {
        onCloseDrawer();
      } else {
        setSearchValue(getValues()[QUERY]);
        setOpenConsentPrompt(true);
      }
    }
  }, [records]);

  return (
    <>
      <InputLabel shrink htmlFor={QUERY} className={css.inputLabel} required>
        {i18n.t("case.enter_id_number")}
      </InputLabel>
      <div className={css.container}>
        <form id={FORM_ID} onSubmit={handleSubmit(onSuccess)}>
          {searchPromptForm(css, i18n).map(formSection => (
            <FormSection
              formSection={formSection}
              key={formSection.unique_id}
              formMode={formMode}
              formMethods={methods}
              disableUnderline
            />
          ))}
        </form>
        <div className={css.search}>
          <ActionButton
            icon={<SearchIcon />}
            text={i18n.t("navigation.search")}
            type={ACTION_BUTTON_TYPES.default}
            rest={{
              form: FORM_ID,
              type: "submit"
            }}
          />
        </div>
      </div>
      <FormHelperText>Why? To prevent creation of duplicate cases.</FormHelperText>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  i18n: PropTypes.object,
  onCloseDrawer: PropTypes.func,
  recordType: PropTypes.string,
  setOpenConsentPrompt: PropTypes.func,
  setSearchValue: PropTypes.func
};

export default Component;
