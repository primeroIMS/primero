import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, Tab, Tabs } from "@material-ui/core";
import { FormContext, useForm } from "react-hook-form";
import { push } from "connected-react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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

import CustomFieldDialog from "./components/custom-field-dialog";
import {
  FieldDialog,
  FieldsList,
  FormBuilderActionButtons,
  TabPanel
} from "./components";
import { clearSelectedForm, fetchForm, saveForm } from "./action-creators";
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
  const updatedFormIds = useSelector(
    state => getUpdatedFormIds(state),
    compare
  );
  const selectedForm = useSelector(state => getSelectedForm(state), compare);
  const selectedField = useSelector(state => getSelectedField(state), compare);
  const selectedSubforms = useSelector(
    state => getSelectedSubforms(state),
    compare
  );
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

  const modeForFieldDialog =
    selectedField.get("name") === NEW_FIELD ? MODES.new : mode;

  const onSubmit = data => {
    dispatch(
      saveForm({
        id,
        saveMethod: formMode.get("isEdit")
          ? SAVE_METHODS.update
          : SAVE_METHODS.new,
        body: {
          data: { ...data, fields: convertToFieldsArray(data.fields || {}) }
        },
        message: i18n.t(
          `forms.messages.${formMode.get("isEdit") ? "updated" : "created"}`
        ),
        subforms: selectedSubforms.toJS()
      })
    );
  };

  useEffect(() => {
    if (saving && (errors?.size || updatedFormIds?.size)) {
      const successful = !errors?.size && updatedFormIds?.size;

      dispatch({
        type: ENQUEUE_SNACKBAR,
        payload: {
          message: successful
            ? i18n.t("forms.messages.save_success")
            : i18n.t("forms.messages.save_with_errors"),
          options: {
            variant: successful ? "success" : "error",
            key: generate.messageKey()
          }
        }
      });
    }
  }, [updatedFormIds]);

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
      }
    };
  }, [id]);

  useEffect(() => {
    if (selectedForm?.size) {
      const fieldTree = convertToFieldsObject(
        selectedForm.get("fields").toJS()
      );

      methods.reset(selectedForm.set("fields", fieldTree).toJS());
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
        if (!methods.control[`fields.${fieldName}.${key}`]) {
          methods.register({ name: `fields.${fieldName}.${key}` });
        }
        methods.setValue(`fields.${fieldName}.${key}`, value);
      });
    });
  };

  return (
    <LoadingIndicator
      hasData={
        formMode.get("isNew") || (formMode.get("isEdit") && selectedForm?.size)
      }
      loading={isLoading}
      type={NAMESPACE}
    >
      <PageHeading
        title={
          formMode.get("isNew")
            ? i18n.t("forms.add")
            : selectedForm.getIn(["name", i18n.locale], i18n.t("forms.label"))
        }
      >
        <FormBuilderActionButtons
          formMode={formMode}
          formRef={formRef}
          handleCancel={handleCancel}
        />
      </PageHeading>
      <PageContent>
        <FormContext {...methods} formMode={formMode}>
          <form>
            <Tabs value={tab} onChange={handleChange}>
              <Tab label={i18n.t("forms.settings")} />
              <Tab label={i18n.t("forms.fields")} />
              <Tab label={i18n.t("forms.translations")} />
            </Tabs>
            <TabPanel tab={tab} index={0}>
              <div className={css.tabContent}>
                {settingsForm(i18n).map(formSection => (
                  <FormSection
                    formSection={formSection}
                    key={formSection.unique_id}
                  />
                ))}
              </div>
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
