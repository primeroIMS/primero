import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { makeStyles } from "@material-ui/core/styles";
import { FormContext, useForm } from "react-hook-form";
import { useSelector, useDispatch, batch } from "react-redux";
import isEqual from "lodash/isEqual";
import SearchIcon from "@material-ui/icons/Search";

import { enqueueSnackbar } from "../../../../../notifier";
import ActionButton from "../../../../../action-button";
import { whichFormMode } from "../../../../../form";
import { FORM_MODE_EDIT } from "../../../../../form/constants";
import { useI18n } from "../../../../../i18n";
import { compare } from "../../../../../../libs";
import ActionDialog, { useDialog } from "../../../../../action-dialog";
import { getSelectedFields } from "../../selectors";
import { selectExistingFields } from "../../action-creators";
import baseStyles from "../styles.css";
import { CUSTOM_FIELD_SELECTOR_DIALOG } from "../custom-field-selector-dialog/constants";

import {
  buildExistingFields,
  buildSelectedFieldList,
  getExistingFieldNames,
  isFieldInList,
  removeFieldFromList
} from "./utils";
import { FieldsTable } from "./components";
import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ parentForm, primeroModule }) => {
  const baseCss = makeStyles(baseStyles)();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const i18n = useI18n();
  const formMethods = useForm();
  const { setDialog, dialogOpen, dialogClose } = useDialog(NAME);

  const formMode = whichFormMode(FORM_MODE_EDIT);
  const watchedFieldQuery = formMethods.watch("field_query", "");

  const selectedFields = useSelector(state => getSelectedFields(state, false), compare);

  const [addedFields, setAddedFields] = useState([]);
  const [removedFields, setRemovedFields] = useState([]);

  const selectedFieldList = buildSelectedFieldList(selectedFields);
  const existingSelectedFields = buildExistingFields(selectedFieldList, addedFields, removedFields);
  const existingFieldNames = getExistingFieldNames(existingSelectedFields);

  const handleClose = () => {
    dialogClose();
  };

  const addField = field => {
    if (isFieldInList(field, removedFields)) {
      setRemovedFields(removeFieldFromList(field, removedFields));
    }

    if (existingFieldNames.includes(field.name)) {
      dispatch(enqueueSnackbar(i18n.t("forms.messages.fields_with_same_name")));
    } else if (!isFieldInList(field, selectedFieldList)) {
      setAddedFields(addedFields.concat(field));
    }
  };

  const removeField = field => {
    if (isFieldInList(field, addedFields)) {
      setAddedFields(removeFieldFromList(field, addedFields));
    } else {
      setRemovedFields(removedFields.concat(field));
    }
  };

  const handleSuccess = () => {
    batch(() => {
      dialogClose();
      dispatch(selectExistingFields({ addedFields, removedFields }));
    });
  };

  const onCreateNewField = () => {
    batch(() => {
      setDialog({ dialog: CUSTOM_FIELD_SELECTOR_DIALOG, open: true });
    });
  };

  const dialogTitle = (
    <>
      <span className={css.existingFieldDialogTitle}>{i18n.t("fields.add_field")}</span>
      <ActionButton outlined text={i18n.t("fields.add_new_field")} rest={{ onClick: onCreateNewField }} />
    </>
  );

  const modalProps = {
    confirmButtonLabel: i18n.t("buttons.select"),
    confirmButtonProps: {
      icon: <CheckIcon />
    },
    dialogTitle,
    open: dialogOpen,
    successHandler: () => handleSuccess(),
    cancelHandler: () => handleClose(),
    omitCloseAfterSuccess: true
  };

  useEffect(() => {
    if (dialogOpen) {
      setAddedFields([]);
      setRemovedFields([]);
    }
  }, [dialogOpen]);

  return (
    <ActionDialog {...modalProps}>
      <FormContext {...formMethods} formMode={formMode}>
        <form className={baseCss.formBuilderDialog}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className={css.searchBox}>
                <SearchIcon />
                <input
                  className={css.fieldQuery}
                  type="text"
                  name="field_query"
                  autoComplete="off"
                  ref={formMethods.register}
                  placeholder={i18n.t("fields.search_existing")}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <FieldsTable
                fieldQuery={watchedFieldQuery}
                selectedFields={existingSelectedFields}
                addField={addField}
                removeField={removeField}
                parentForm={parentForm}
                primeroModule={primeroModule}
              />
            </Grid>
          </Grid>
        </form>
      </FormContext>
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.whyDidYouRender = true;

Component.propTypes = {
  parentForm: PropTypes.string.isRequired,
  primeroModule: PropTypes.string.isRequired
};

export default React.memo(Component, isEqual);
