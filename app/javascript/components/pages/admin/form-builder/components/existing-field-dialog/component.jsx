import { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, batch } from "react-redux";
import isEqual from "lodash/isEqual";
import SearchIcon from "@material-ui/icons/Search";

import { enqueueSnackbar } from "../../../../../notifier";
import ActionButton from "../../../../../action-button";
import { useI18n } from "../../../../../i18n";
import { useMemoizedSelector } from "../../../../../../libs";
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

const useStylesBase = makeStyles(baseStyles);
const useStyles = makeStyles(styles);

const Component = ({ parentForm, primeroModule }) => {
  const baseCss = useStylesBase();
  const css = useStyles();
  const dispatch = useDispatch();
  const i18n = useI18n();
  const { control, register } = useForm();
  const { setDialog, dialogOpen, dialogClose } = useDialog(NAME);

  const watchedFieldQuery = useWatch({ control, name: "field_query", defaultValue: "" });

  const selectedFields = useMemoizedSelector(state => getSelectedFields(state, false));

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
    successHandler: handleSuccess,
    cancelHandler: handleClose,
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
                ref={register}
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
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  parentForm: PropTypes.string.isRequired,
  primeroModule: PropTypes.string.isRequired
};

export default memo(Component, isEqual);
