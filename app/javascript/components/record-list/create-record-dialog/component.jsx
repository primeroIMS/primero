// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import { push } from "connected-react-router";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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

import { FORM_ID, NAME } from "./constants";
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
    handleSubmit
  } = methods;

  const record = useMemoizedSelector(state => getRecordsData(state, recordType));

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

  return (
    <Dialog open={open} maxWidth="sm" fullWidth data-testid="CreateRecordDialog">
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
        <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
          {searchForm(i18n).map(formSection => (
            <FormSection
              formSection={formSection}
              key={formSection.unique_id}
              formMode={formMode}
              formMethods={methods}
            />
          ))}
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
          <div className={css.search}>
            <ActionButton
              icon={<SearchIcon />}
              text="navigation.search"
              type={ACTION_BUTTON_TYPES.default}
              rest={{
                form: FORM_ID,
                type: "submit"
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
