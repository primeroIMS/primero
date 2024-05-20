// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import { push } from "connected-react-router";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch } from "react-redux";

import { useMemoizedSelector } from "../../../libs";
import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";
import { submitHandler, whichFormMode } from "../../form";
import FormSection from "../../form/components/form-section";
import { FORM_MODE_NEW } from "../../form/constants";
import { useI18n } from "../../i18n";
import { applyFilters } from "../../index-filters";
import { getRecordsData } from "../../index-table";
import { enqueueSnackbar } from "../../notifier";
import { SEARCH_OR_CREATE_FILTERS } from "../constants";
import SearchNameToggle from "../../index-filters/components/search-name-toggle";
import PhoneticHelpText from "../../index-filters/components/phonetic-help-text";
import { searchTitleI18nKey } from "../../index-filters/components/search-box/utils";
import SearchButton from "../../record-creation-flow/components/search-button";

import { FORM_ID, NAME, PHONETIC_FIELD_NAME } from "./constants";
import { searchForm } from "./forms";
import css from "./styles.css";

const Component = ({ moduleUniqueId, open, recordType, setOpen }) => {
  const formMode = whichFormMode(FORM_MODE_NEW);

  const dispatch = useDispatch();
  const i18n = useI18n();

  const methods = useForm({ defaultValues: {} });
  const {
    formState: { dirtyFields, isSubmitted },
    getValues,
    handleSubmit,
    control,
    setValue,
    register
  } = methods;

  const phonetic = useWatch({ control, name: PHONETIC_FIELD_NAME, defaultValue: false });
  const record = useMemoizedSelector(state => getRecordsData(state, recordType));
  const searchTitle = i18n.t(searchTitleI18nKey(phonetic));
  const searchHelpText = i18n.t("case.search_helper_text");

  const onSubmit = data => {
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
            data: { ...SEARCH_OR_CREATE_FILTERS, ...formData, id_search: true }
          })
        );
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateNewCase = () => {
    dispatch(push(`/${recordType}/${moduleUniqueId}/new`));
  };

  const handleSwitchChange = event => {
    setValue(PHONETIC_FIELD_NAME, event.target.checked, { shouldDirty: true });
  };

  useEffect(() => {
    const hasData = Boolean(record?.size);

    if (open && isSubmitted) {
      if (hasData) {
        setOpen(false);
      } else {
        const { query } = getValues();

        setOpen(false);
        handleCreateNewCase();
        dispatch(enqueueSnackbar(i18n.t("case.id_search_no_results", { search_query: query }), "error"));
      }
    }
  }, [record]);

  useEffect(() => {
    register(PHONETIC_FIELD_NAME);
  }, [register]);

  useEffect(() => {
    if (open) {
      setValue(PHONETIC_FIELD_NAME, false);
    }
  }, [open]);

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle disableTypography>
        <div className={css.title}>
          <div className={css.newCase}>{i18n.t("cases.register_new_case")}</div>
          <div className={css.close}>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} className={css.searchForm}>
          {searchForm(searchTitle, searchHelpText).map(formSection => (
            <FormSection
              formSection={formSection}
              key={formSection.unique_id}
              formMode={formMode}
              formMethods={methods}
            />
          ))}
          <div className={css.search}>
            <div>
              <SearchNameToggle handleChange={handleSwitchChange} value={phonetic} />
            </div>
            <div className={css.searchButton}>
              <SearchButton formId={FORM_ID} />
            </div>
          </div>
          {phonetic && <PhoneticHelpText />}
        </form>
      </DialogContent>
      <DialogActions>
        <div className={css.actions}>
          <div className={css.createNewCase}>
            <ActionButton
              icon={<AddIcon />}
              text="case.create_new_case"
              type={ACTION_BUTTON_TYPES.default}
              rest={{ onClick: handleCreateNewCase }}
              size="large"
            />
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  open: false
};

Component.propTypes = {
  moduleUniqueId: PropTypes.string.isRequired,
  open: PropTypes.bool,
  recordType: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired
};

export default Component;
