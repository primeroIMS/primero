/* eslint-disable react/display-name,  react/no-multi-comp */
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, Tab, Tabs } from "@material-ui/core";
import { FormContext, useForm } from "react-hook-form";
import { push } from "connected-react-router";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import get from "lodash/get";

import { selectDialog } from "../../../record-actions/selectors";
import { setDialog } from "../../../record-actions/action-creators";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import LoadingIndicator from "../../../loading-indicator";
import { useI18n } from "../../../i18n";
import { PageContent, PageHeading } from "../../../page";
import FormSection from "../../../form/components/form-section";
import { getLookupByUniqueId } from "../../../form/selectors";
import { SUBFORM_SECTION, submitHandler, whichFormMode } from "../../../form";
import { ROUTES, SAVE_METHODS, MODES } from "../../../../config";
import { compare, dataToJS, getObjectPath } from "../../../../libs";
import NAMESPACE from "../forms-list/namespace";
import { getIsLoading } from "../forms-list/selectors";
import { fetchForms } from "../forms-list/action-creators";

import {
  CustomFieldDialog,
  FieldDialog,
  FieldsList,
  FieldTranslationsDialog,
  FormBuilderActionButtons,
  FormTranslationsDialog,
  TabPanel,
  TranslationsForm
} from "./components";
import { NAME as FieldTranslationsDialogName } from "./components/field-translations-dialog";
import { localesToRender } from "./components/utils";
import { NAME as FormTranslationsDialogName } from "./components/form-translations-dialog/constants";
import {
  clearSelectedForm,
  clearSubforms,
  fetchForm,
  saveForm,
  saveSubforms,
  updateFieldTranslations,
  updateSelectedSubform
} from "./action-creators";
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
import {
  buildFormGroupUniqueId,
  convertToFieldsArray,
  convertToFieldsObject,
  getFieldsTranslations,
  getSubformErrorMessages,
  mergeTranslations
} from "./utils";
import styles from "./styles.css";
import { transformValues } from "./components/field-dialog/utils";

const Component = ({ mode }) => {
  const css = makeStyles(styles)();
  const { id } = useParams();
  const formMode = whichFormMode(mode);
  const formRef = useRef();
  const dispatch = useDispatch();
  const i18n = useI18n();
  const selectedLocaleId = localesToRender(i18n)?.first()?.get("id");
  const [tab, setTab] = useState(0);
  const saving = useSelector(state => getSavingRecord(state), compare);
  const errors = useSelector(state => getServerErrors(state), compare);
  const updatedFormIds = useSelector(state => getUpdatedFormIds(state), compare);
  const selectedForm = useSelector(state => getSelectedForm(state), compare);
  const selectedField = useSelector(state => getSelectedField(state), compare);
  const selectedSubforms = useSelector(state => getSelectedSubforms(state), compare);
  const openFieldTranslationsDialog = useSelector(state => selectDialog(state, FieldTranslationsDialogName));
  const isLoading = useSelector(state => getIsLoading(state));
  const methods = useForm({
    validationSchema: validationSchema(i18n),
    defaultValues: {}
  });
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");
  const parentForm = methods.watch("parent_form");
  const moduleIds = methods.watch("module_ids", []);
  const formGroupLookup = useSelector(
    state => getLookupByUniqueId(state, buildFormGroupUniqueId(moduleIds[0], parentForm)),
    compare
  );

  const handleChange = (event, selectedTab) => {
    setTab(selectedTab);
  };

  const handleCancel = () => {
    dispatch(push(ROUTES.forms));
  };

  const modeForFieldDialog = selectedField.get("name") === NEW_FIELD ? MODES.new : mode;

  const onSubmit = data => {
    const mergedData = mergeTranslations(data);
    const subforms = selectedSubforms?.toJS();
    const updatedNewFields = convertToFieldsArray(mergedData.fields || {});
    const body = {
      data: { ...mergedData, fields: updatedNewFields }
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
    getObjectPath("", data).forEach(path => {
      if (!methods.control.fields[path]) {
        methods.register({ name: path });
      }

      const value = get(data, path);

      methods.setValue(`translations.${path}`, value);
      methods.setValue(path, value);
    });
  };

  const onUpdateFieldTranslations = data => {
    if (selectedField.get("type") !== SUBFORM_SECTION) {
      getObjectPath("", data).forEach(path => {
        const name = `fields.${path}`;

        if (!methods.control.fields[path]) {
          methods.register({ name });
        }

        methods.setValue(name, get(data, path));
      });
    } else {
      const fieldData = { [selectedField.get("name")]: { display_name: data.subform_section.name } };

      getObjectPath("", fieldData).forEach(path => {
        methods.setValue(`fields.${path}`, get(fieldData, path));
      });

      dispatch(updateSelectedSubform(data.subform_section));
    }
  };

  const onEnglishTextChange = event => {
    const { name, value } = event.target;

    methods.setValue(`translations.${name}`, value);
  };

  const renderTranlationsDialog = () => {
    const openDialog = tab === 2 && selectedField?.toSeq()?.size && openFieldTranslationsDialog;
    const { fields } = methods.getValues({ nest: true });

    return openDialog ? (
      <FieldTranslationsDialog
        mode={mode}
        open={openDialog}
        field={selectedField}
        currentValues={fields}
        onSuccess={onUpdateFieldTranslations}
      />
    ) : null;
  };

  useEffect(() => {
    if (errors?.size) {
      const messages = dataToJS(getSubformErrorMessages(errors, i18n));

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
        const formData = selectedForm.set("fields", fieldTree).toJS();

        methods.reset({
          ...formData,
          selected_locale_id: selectedLocaleId,
          translations: {
            name: formData.name,
            description: formData.description,
            fields: getFieldsTranslations(fieldTree)
          }
        });
      }
    }
  }, [selectedForm]);

  useEffect(() => {
    if (tab === 1) {
      dispatch(updateFieldTranslations(methods.getValues({ nest: true }).fields));
    }
  }, [tab]);

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

      getObjectPath("", transformedFieldValues).forEach(path => {
        const isDisabledProp = path.endsWith("disabled");
        const value = get(transformedFieldValues, path);
        const fieldFullPath = `fields.${fieldName}.${path}`;

        if (!methods.control.fields[fieldFullPath] && path !== "display_name.en") {
          methods.register({ name: fieldFullPath });
        }

        methods.setValue(fieldFullPath, isDisabledProp ? !value : value);
      });
    });
  };

  const translationsNote = () => (
    <p className={css.translationsNote}>
      <strong>{i18n.t("forms.translations.note")}</strong> {i18n.t("forms.translations.note_form_group")}{" "}
      <Link to={`/admin/lookups/${formGroupLookup?.get("id")}/edit`}>
        {i18n.t("forms.translations.edit_form_group")}
      </Link>
    </p>
  );

  const hasData = formMode.get("isNew") || Boolean(formMode.get("isEdit") && selectedForm?.toSeq()?.size);
  const loading = isLoading || !selectedForm?.toSeq()?.size;

  return (
    <LoadingIndicator hasData={hasData} loading={loading} type={NAMESPACE}>
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
                {settingsForm({ formMode, onManageTranslation, onEnglishTextChange, i18n }).map(formSection => (
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
              <div className={css.tabTranslations}>
                <h1 className={css.heading}>{i18n.t("forms.translations.title")}</h1>
                {translationsNote()}
                <TranslationsForm mode={mode} />
                {renderTranlationsDialog()}
              </div>
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
