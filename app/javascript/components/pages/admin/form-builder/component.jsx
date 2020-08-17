import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, Tab, Tabs } from "@material-ui/core";
import { FormContext, useForm } from "react-hook-form";
import { push } from "connected-react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setDialog } from "../../../record-actions/action-creators";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import LoadingIndicator from "../../../loading-indicator";
import { useI18n } from "../../../i18n";
import { PageContent, PageHeading } from "../../../page";
import FormSection from "../../../form/components/form-section";
import { submitHandler, whichFormMode } from "../../../form";
import { ROUTES, SAVE_METHODS, MODES } from "../../../../config";
import { compare } from "../../../../libs";
import NAMESPACE from "../forms-list/namespace";
import { getIsLoading } from "../forms-list/selectors";
import { fetchForms } from "../forms-list/action-creators";

import {
  CustomFieldDialog,
  FieldDialog,
  FieldsList,
  FormBuilderActionButtons,
  FormTranslationsDialog,
  TabPanel
} from "./components";
import { NAME as FormTranslationsDialogName } from "./components/form-translations-dialog/constants";
import { clearSelectedForm, clearSubforms, fetchForm, saveForm, saveSubforms } from "./action-creators";
import { settingsForm, validationSchema } from "./forms";
import { NAME, NEW_FIELD } from "./constants";
import {
  getSavingRecord,
  getSelectedField,
  getSelectedForm,
  getSelectedSubforms,
  getServerErrors,
  getUpdatedFormIds
} from "./selectors";
import { convertToFieldsArray, convertToFieldsObject } from "./utils";
import styles from "./styles.css";
import { transformValues } from "./components/field-dialog/utils";

const Component = ({ mode }) => {
  const css = makeStyles(styles)();
  const { id } = useParams();
  const formMode = whichFormMode(mode);
  const formRef = useRef();
  const dispatch = useDispatch();
  const i18n = useI18n();
  const [tab, setTab] = useState(0);
  const saving = useSelector(state => getSavingRecord(state), compare);
  const errors = useSelector(state => getServerErrors(state), compare);
  const updatedFormIds = useSelector(state => getUpdatedFormIds(state), compare);
  const selectedForm = useSelector(state => getSelectedForm(state), compare);
  const selectedField = useSelector(state => getSelectedField(state), compare);
  const selectedSubforms = useSelector(state => getSelectedSubforms(state), compare);
  const isLoading = useSelector(state => getIsLoading(state));
  const methods = useForm({
    validationSchema: validationSchema(i18n),
    defaultValues: {}
  });
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");

  const handleChange = (event, selectedTab) => {
    setTab(selectedTab);
  };

  const handleCancel = () => {
    dispatch(push(ROUTES.forms));
  };

  const modeForFieldDialog = selectedField.get("name") === NEW_FIELD ? MODES.new : mode;

  const onSubmit = data => {
    const subforms = selectedSubforms?.toJS();
    const updatedNewFields = convertToFieldsArray(data.fields || {});
    const body = {
      data: { ...data, fields: updatedNewFields }
    };
    const parentFormParams = {
      id,
      saveMethod: formMode.get("isEdit") ? SAVE_METHODS.update : SAVE_METHODS.new,
      body,
      message: i18n.t(`forms.messages.${formMode.get("isEdit") ? "updated" : "created"}`)
    };

    if (subforms.length > 0) {
      dispatch(saveSubforms(subforms, parentFormParams));
    } else {
      dispatch(saveForm(parentFormParams));
    }
  };

  const onManageTranslation = () => {
    dispatch(setDialog({ dialog: FormTranslationsDialogName, open: true }));
  };

  const onUpdateTranslation = data => {
    Object.entries(data).forEach(([fieldName, locales]) => {
      Object.entries(locales).forEach(([localeId, value]) => {
        const fieldPath = `${fieldName}.${localeId}`;

        if (!methods.control.fields[fieldPath]) {
          methods.register({ name: fieldPath });
        }
        methods.setValue(`${fieldPath}`, value);
      });
    });
  };

  useEffect(() => {
    if (errors?.size) {
      const errorsObject = errors
        .map(t =>
          t
            .get("errors")
            .map(error => ({ message: error.get("message"), detail: error.get("detail"), value: error.get("value") }))
        )
        .toJS();

      const errorsWithKeys = errorsObject.flat(2).map(error => ({
        message: error.message[0],
        rest: { [error.detail]: error.value }
      }));
      const messages = errorsWithKeys.map(error => i18n.t(error.message, error.rest)).join(", ");

      dispatch({
        type: ENQUEUE_SNACKBAR,
        payload: {
          message: messages,
          options: {
            variant: "error",
            key: generate.messageKey(messages)
          }
        }
      });
    }
    if (saving && (errors?.size || updatedFormIds?.size)) {
      const successful = !errors?.size && updatedFormIds?.size;
      const message = successful ? i18n.t("forms.messages.save_success") : i18n.t("forms.messages.save_with_errors");

      dispatch({
        type: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: successful ? "success" : "error",
            key: generate.messageKey(message)
          }
        }
      });

      if (formMode.get("isNew")) {
        dispatch(push(`${ROUTES.forms}/${updatedFormIds.first()}/edit`));
      }
    }
  }, [updatedFormIds, errors]);

  useEffect(() => {
    dispatch(fetchForms());
    dispatch(clearSelectedForm());
  }, []);

  useEffect(() => {
    if (isEditOrShow) {
      dispatch(fetchForm(id));
    }

    return () => {
      if (isEditOrShow) {
        dispatch(clearSelectedForm());
        dispatch(clearSubforms());
      }
    };
  }, [id]);

  useEffect(() => {
    if (selectedForm?.toSeq()?.size) {
      if (selectedForm.get("is_nested")) {
        dispatch(push(ROUTES.forms));
      } else {
        const fieldTree = convertToFieldsObject(selectedForm.get("fields").toJS());

        methods.reset(selectedForm.set("fields", fieldTree).toJS());
      }
    }
  }, [selectedForm]);

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

  const onSuccess = data => {
    Object.entries(data).forEach(([fieldName, fieldData]) => {
      const transformedFieldValues = transformValues(fieldData, true);

      Object.entries(transformedFieldValues).forEach(([key, value]) => {
        const isDisabledProp = key === "disabled";

        if (!methods.control.fields[`fields.${fieldName}.${key}`]) {
          methods.register({ name: `fields.${fieldName}.${key}` });
        }
        methods.setValue(`fields.${fieldName}.${key}`, isDisabledProp ? !value : value);
      });
    });
  };

  return (
    <LoadingIndicator
      hasData={formMode.get("isNew") || Boolean(formMode.get("isEdit") && selectedForm?.toSeq()?.size)}
      loading={isLoading || !selectedForm?.toSeq()?.size}
      type={NAMESPACE}
    >
      <PageHeading
        title={
          formMode.get("isNew") ? i18n.t("forms.add") : selectedForm.getIn(["name", i18n.locale], i18n.t("forms.label"))
        }
      >
        <FormBuilderActionButtons formMode={formMode} formRef={formRef} handleCancel={handleCancel} />
      </PageHeading>
      <PageContent>
        <FormContext {...methods} formMode={formMode}>
          <form>
            <Tabs value={tab} onChange={handleChange}>
              <Tab label={i18n.t("forms.settings")} />
              <Tab className={css.tabHeader} label={i18n.t("forms.fields")} disabled={formMode.get("isNew")} />
              <Tab
                className={css.tabHeader}
                label={i18n.t("forms.translations.title")}
                disabled={formMode.get("isNew")}
              />
            </Tabs>
            <TabPanel tab={tab} index={0}>
              <div className={css.tabContent}>
                {settingsForm({ formMode, onManageTranslation, i18n }).map(formSection => (
                  <FormSection formSection={formSection} key={formSection.unique_id} />
                ))}
              </div>
              <FormTranslationsDialog
                mode={mode}
                formSection={selectedForm}
                currentValues={methods.getValues({ nest: true })}
                onSuccess={onUpdateTranslation}
              />
            </TabPanel>
            <TabPanel tab={tab} index={1}>
              <div className={css.tabFields}>
                <h1 className={css.heading}>{i18n.t("forms.fields")}</h1>
                <CustomFieldDialog />
              </div>
              <FieldsList />
              <FieldDialog mode={modeForFieldDialog} onSuccess={onSuccess} />
            </TabPanel>
            <TabPanel tab={tab} index={2}>
              Item Three
            </TabPanel>
          </form>
        </FormContext>
      </PageContent>
    </LoadingIndicator>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Component;
