import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, Tab, Tabs } from "@material-ui/core";
import { FormContext, useForm } from "react-hook-form";
import { push } from "connected-react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useI18n } from "../../../i18n";
import { PageContent, PageHeading } from "../../../page";
import FormSection from "../../../form/components/form-section";
import { submitHandler, whichFormMode } from "../../../form";
import { ROUTES, SAVE_METHODS } from "../../../../config";
import { compare } from "../../../../libs";

import {
  FieldDialog,
  FieldsList,
  FormBuilderActionButtons,
  TabPanel
} from "./components";
import { clearSelectedForm, fetchForm, saveForm } from "./action-creators";
import { settingsForm, validationSchema } from "./forms";
import { NAME } from "./constants";
import { getSelectedForm } from "./selectors";
import { convertToFieldsArray, convertToFieldsObject } from "./utils";
import styles from "./styles.css";

const Component = ({ mode }) => {
  const css = makeStyles(styles)();
  const { id } = useParams();
  const formMode = whichFormMode(mode);
  const formRef = useRef();
  const dispatch = useDispatch();
  const i18n = useI18n();
  const [tab, setTab] = useState(0);
  const selectedForm = useSelector(state => getSelectedForm(state), compare);
  const methods = useForm({ validationSchema, defaultValues: {} });
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");

  const handleChange = (event, selectedTab) => {
    setTab(selectedTab);
  };

  const handleCancel = () => {
    dispatch(push(ROUTES.forms));
  };

  const onSubmit = data => {
    dispatch(
      saveForm({
        id,
        saveMethod: formMode.get("isEdit")
          ? SAVE_METHODS.update
          : SAVE_METHODS.new,
        body: { data: { ...data, fields: convertToFieldsArray(data.fields) } },
        message: i18n.t(
          `forms.messages.${formMode.get("isEdit") ? "updated" : "created"}`
        )
      })
    );
  };

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
    Object.entries(data).forEach(entry =>
      Object.entries(entry[1]).forEach(valueEntry => {
        if (!methods.control[`fields.${entry[0]}.${valueEntry[0]}`]) {
          methods.register({ name: `fields.${entry[0]}.${valueEntry[0]}` });
        }
        methods.setValue(`fields.${entry[0]}.${valueEntry[0]}`, valueEntry[1]);
      })
    );
  };

  return (
    <>
      <PageHeading title={i18n.t("forms.add")}>
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
              <div className={css.tabContent}>
                <h1>{i18n.t("forms.fields")}</h1>
              </div>
              <FieldsList />
              <FieldDialog onSuccess={onSuccess} />
            </TabPanel>
            <TabPanel tab={tab} index={2}>
              Item Three
            </TabPanel>
          </form>
        </FormContext>
      </PageContent>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Component;
