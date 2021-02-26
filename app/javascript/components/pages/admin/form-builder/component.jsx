/* eslint-disable react/display-name,  react/no-multi-comp */
import { useEffect, useState } from "react";
import { fromJS } from "immutable";
import PropTypes from "prop-types";
import { makeStyles, Tab, Tabs } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { push } from "connected-react-router";
import { useParams } from "react-router-dom";
import { batch, useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { isEqual } from "lodash";

import { fetchLookups } from "../../../record-form/action-creators";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import LoadingIndicator from "../../../loading-indicator";
import { useI18n } from "../../../i18n";
import { PageContent, PageHeading } from "../../../page";
import { submitHandler, whichFormMode } from "../../../form";
import { ROUTES, SAVE_METHODS, MODES } from "../../../../config";
import { compare, dataToJS, displayNameHelper } from "../../../../libs";
import NAMESPACE from "../forms-list/namespace";
import { getIsLoading } from "../forms-list/selectors";
import { fetchForms } from "../forms-list/action-creators";
import { useApp } from "../../../application";

import { FormBuilderActionButtons, TranslationsTab, SettingsTab, FieldsTab } from "./components";
import { localesToRender } from "./components/utils";
import {
  clearSelectedForm,
  clearSubforms,
  fetchForm,
  saveForm,
  saveSubforms,
  updateFieldTranslations
} from "./action-creators";
import { validationSchema } from "./forms";
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
  convertToFieldsArray,
  convertToFieldsObject,
  getFieldsTranslations,
  getSubformErrorMessages,
  mergeTranslations
} from "./utils";
import styles from "./styles.css";

const Component = ({ mode }) => {
  const css = makeStyles(styles)();
  const { id } = useParams();
  const formMode = whichFormMode(mode);
  const dispatch = useDispatch();
  const i18n = useI18n();
  const { limitedProductionSite } = useApp();
  const selectedLocaleId = localesToRender(i18n)?.first()?.get("id");

  const [tab, setTab] = useState(0);
  const [moduleId, setModuleId] = useState("");
  const [parentForm, setParentForm] = useState("");

  const errors = useSelector(state => getServerErrors(state), compare);
  const saving = useSelector(state => getSavingRecord(state), isEqual);
  const updatedFormIds = useSelector(state => getUpdatedFormIds(state), compare);
  const selectedForm = useSelector(state => getSelectedForm(state), compare);
  const isLoading = useSelector(state => getIsLoading(state), isEqual);
  const selectedField = useSelector(state => getSelectedField(state), compare);
  const selectedSubforms = useSelector(state => getSelectedSubforms(state), compare);

  const methods = useForm({
    resolver: yupResolver(validationSchema(i18n)),
    defaultValues: {},
    shouldUnregister: false
  });

  const {
    formState: { dirtyFields }
  } = methods;

  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");

  const handleChange = (_, selectedTab) => {
    if (selectedTab !== tab) {
      setTab(selectedTab);
    }
  };

  const handleCancel = () => {
    dispatch(push(ROUTES.forms));
  };

  const modeForFieldDialog = selectedField.get("name") === NEW_FIELD ? MODES.new : mode;

  const onSubmit = data => {
    submitHandler({
      data,
      dispatch,
      isEdit: formMode.isEdit,
      dirtyFields,
      submitAlways: !selectedSubforms?.isEmpty(),
      onSubmit: formData => {
        const mergedData = mergeTranslations(formData);
        const subforms = selectedSubforms?.toJS();
        const updatedNewFields = convertToFieldsArray(mergedData.fields || {});
        const body = {
          data: { ...mergedData, ...(updatedNewFields.length && { fields: updatedNewFields }) }
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
      }
    });
  };

  const pageTitle = formMode.get("isNew")
    ? i18n.t("forms.add")
    : (selectedForm.get("name") && displayNameHelper(dataToJS(selectedForm.get("name")), i18n.locale)) ||
      i18n.t("forms.label");

  const hasData = formMode.get("isNew") || Boolean(formMode.get("isEdit") && selectedForm?.toSeq()?.size);

  const loading = isLoading || !selectedForm?.toSeq()?.size;

  useEffect(() => {
    if (!saving && id && !loading && formMode.get("isEdit")) {
      dispatch(fetchForms());
    }
  }, [saving]);

  useEffect(() => {
    if (errors?.size) {
      const messages = dataToJS(getSubformErrorMessages(errors, i18n));

      if (messages.length) {
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
    }
  }, [updatedFormIds, errors]);

  useEffect(() => {
    batch(() => {
      dispatch(fetchLookups());
      dispatch(fetchForms());
      dispatch(clearSelectedForm());
      dispatch(clearSubforms());
    });
  }, []);

  useEffect(() => {
    if (isEditOrShow) {
      dispatch(fetchForm(id));
    }

    return () => {
      if (isEditOrShow) {
        batch(() => {
          dispatch(clearSelectedForm());
          dispatch(clearSubforms());
        });
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

        setModuleId(selectedForm.get("module_ids", fromJS([])).first());
        setParentForm(selectedForm.get("parent_form"));
      }
    }
  }, [selectedForm]);

  useEffect(() => {
    const currentValues = methods.getValues({ nest: true });

    if (tab === 1) {
      dispatch(updateFieldTranslations(currentValues.fields || {}));
    }

    if (tab === 2) {
      const moduleIds = currentValues.module_ids;

      if (moduleIds && moduleIds[0] !== moduleId) {
        setModuleId(moduleIds[0]);
      }

      if (parentForm !== currentValues.parentForm) {
        setParentForm(currentValues.parent_form);
      }
    }
  }, [tab]);

  return (
    <LoadingIndicator hasData={hasData} loading={loading} type={NAMESPACE}>
      <PageHeading title={pageTitle}>
        <FormBuilderActionButtons
          formMode={formMode}
          limitedProductionSite={limitedProductionSite}
          handleSubmit={methods.handleSubmit(onSubmit)}
          handleCancel={handleCancel}
        />
      </PageHeading>
      <PageContent>
        <Tabs value={tab} onChange={handleChange}>
          <Tab label={i18n.t("forms.settings")} />
          <Tab className={css.tabHeader} label={i18n.t("forms.fields")} disabled={formMode.get("isNew")} />
          <Tab className={css.tabHeader} label={i18n.t("forms.translations.title")} disabled={formMode.get("isNew")} />
        </Tabs>
        {tab === 0 && (
          <SettingsTab
            tab={tab}
            index={0}
            mode={mode}
            formMethods={methods}
            limitedProductionSite={limitedProductionSite}
          />
        )}
        {tab === 1 && (
          <FieldsTab
            tab={tab}
            index={1}
            mode={modeForFieldDialog}
            formMethods={methods}
            limitedProductionSite={limitedProductionSite}
          />
        )}
        {tab === 2 && (
          <TranslationsTab
            mode={mode}
            moduleId={moduleId}
            parentForm={parentForm}
            selectedField={selectedField}
            formMethods={methods}
            index={2}
            tab={tab}
          />
        )}
      </PageContent>
    </LoadingIndicator>
  );
};

Component.displayName = NAME;

Component.whyDidYouRender = true;

Component.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Component;
