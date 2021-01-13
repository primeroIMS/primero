import React, { useEffect, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import { push } from "connected-react-router";
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import { getRecordsData } from "../../index-table";
import { applyFilters } from "../../index-filters";
import FormSection from "../../form/components/form-section";
import { submitHandler, whichFormMode } from "../../form";
import { compare } from "../../../libs";
import bindFormSubmit from "../../../libs/submit-form";
import { FORM_MODE_NEW } from "../../form/constants";
import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";
import { useI18n } from "../../i18n";
import { DEFAULT_FILTERS } from "../constants";
import { enqueueSnackbar } from "../../notifier";

import { searchForm } from "./forms";
import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ moduleUniqueId, open, recordType, setOpen }) => {
  const css = makeStyles(styles)();
  const formRef = useRef();
  const dispatch = useDispatch();
  const i18n = useI18n();
  const formMode = whichFormMode(FORM_MODE_NEW);
  const methods = useForm({ defaultValues: {} });
  const data = useSelector(state => getRecordsData(state, recordType), compare);

  const onSubmit = (formData, event) => {
    if (event) {
      event.preventDefault();
    }

    dispatch(
      applyFilters({
        recordType,
        data: { ...DEFAULT_FILTERS, ...formData, id_search: true }
      })
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateNewCase = () => {
    dispatch(push(`/${recordType}/${moduleUniqueId}/new`));
  };

  useEffect(() => {
    const hasData = Boolean(data?.size);

    if (open && methods.formState.isSubmitted) {
      if (hasData) {
        setOpen(false);
      } else {
        const { query } = methods.getValues();

        setOpen(false);
        handleCreateNewCase();
        dispatch(enqueueSnackbar(i18n.t("case.id_search_no_results", { search_query: query }), "error"));
      }
    }
  }, [data]);

  useImperativeHandle(
    formRef,
    submitHandler({
      dispatch,
      formMethods: methods,
      formMode,
      i18n,
      initialValues: {},
      onSubmit
    })
  );

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
        <FormProvider {...methods} formMode={formMode}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {searchForm(i18n).map(formSection => (
              <FormSection formSection={formSection} key={formSection.unique_id} />
            ))}
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <div className={css.actions}>
          <div className={css.createNewCase}>
            <ActionButton
              icon={<AddIcon />}
              text={i18n.t("case.create_new_case")}
              type={ACTION_BUTTON_TYPES.default}
              rest={{ onClick: handleCreateNewCase }}
            />
          </div>
          <div className={css.search}>
            <ActionButton
              icon={<SearchIcon />}
              text={i18n.t("navigation.search")}
              type={ACTION_BUTTON_TYPES.default}
              rest={{
                onClick: () => bindFormSubmit(formRef)
              }}
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
