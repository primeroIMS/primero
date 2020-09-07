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
import ActionDialog from "../../../../../action-dialog";
import { selectDialog } from "../../../../../record-actions/selectors";
import { setDialog } from "../../../../../record-actions/action-creators";
import { getSelectedFields } from "../../selectors";
import { selectExistingFields } from "../../action-creators";
import baseStyles from "../styles.css";
import { CUSTOM_FIELD_SELECTOR_DIALOG } from "../custom-field-selector-dialog/constants";

import { FieldsTable } from "./components";
import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ parentForm, primeroModule }) => {
  const baseCss = makeStyles(baseStyles)();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const i18n = useI18n();
  const formMethods = useForm();
  const formMode = whichFormMode(FORM_MODE_EDIT);
  const watchedFieldQuery = formMethods.watch("field_query", "");
  const selectedFields = useSelector(state => getSelectedFields(state, false), compare);
  const [addedFields, setAddedFields] = useState([]);
  const [removedFields, setRemovedFields] = useState([]);
  const fieldIsRemoved = field => removedFields.some(removed => isEqual(field, removed));
  const fieldIsAdded = field => addedFields.some(added => isEqual(field, added));
  const existingSelectedFields = selectedFields
    .map(field => ({ id: field.get("id"), name: field.get("name") }))
    .toJS()
    .concat(addedFields)
    .filter(field => !fieldIsRemoved(field));
  const existingFieldNames = existingSelectedFields.map(existingField => existingField.name);
  const open = useSelector(state => selectDialog(state, NAME));

  const handleClose = () => {
    dispatch(setDialog({ dialog: NAME, open: false }));
  };

  const addField = field => {
    if (fieldIsRemoved(field)) {
      setRemovedFields(removedFields.filter(removed => isEqual(field, removed)));
    }

    if (existingFieldNames.includes(field.name)) {
      dispatch(enqueueSnackbar(i18n.t("forms.messages.fields_with_same_name")));
    } else {
      setAddedFields(addedFields.concat(field));
    }
  };

  const removeField = field => {
    if (fieldIsAdded(field)) {
      setAddedFields(addedFields.filter(added => !isEqual(field, added)));
    } else {
      setRemovedFields(removedFields.concat(field));
    }
  };

  const handleSuccess = () => {
    batch(() => {
      dispatch(setDialog({ dialog: NAME, open: false }));
      dispatch(selectExistingFields({ addedFields, removedFields }));
    });
  };

  const onCreateNewField = () => {
    batch(() => {
      dispatch(setDialog({ dialog: NAME, open: false }));
      dispatch(setDialog({ dialog: CUSTOM_FIELD_SELECTOR_DIALOG, open: true }));
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
    open,
    successHandler: () => handleSuccess(),
    cancelHandler: () => handleClose(),
    omitCloseAfterSuccess: true
  };

  useEffect(() => {
    if (open) {
      setAddedFields([]);
      setRemovedFields([]);
    }
  }, [open]);

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
