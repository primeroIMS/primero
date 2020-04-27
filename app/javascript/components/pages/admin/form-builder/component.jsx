import React, { useImperativeHandle, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Tab, Tabs } from "@material-ui/core";
import { FormContext, useForm } from "react-hook-form";
import { push } from "connected-react-router";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useI18n } from "../../../i18n";
import { PageContent, PageHeading } from "../../../page";
import FormSection from "../../../form/components/form-section";
import { whichFormMode, submitHandler } from "../../../form";
import { ROUTES, SAVE_METHODS } from "../../../../config";

import { TabPanel, FormBuilderActionButtons } from "./components";
import { saveForm } from "./action-creators";
import { settingsForm, validationSchema } from "./forms";
import { NAME } from "./constants";

const Component = ({ mode }) => {
  const { id } = useParams();
  const formMode = whichFormMode(mode);
  const formRef = useRef();
  const dispatch = useDispatch();
  const i18n = useI18n();
  const [tab, setTab] = useState(0);
  const methods = useForm({ validationSchema, defaultValues: {} });

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
        body: { data },
        message: i18n.t(
          `forms.messages.${formMode.get("isEdit") ? "updated" : "created"}`
        )
      })
    );
  };

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
              {settingsForm(i18n).map(formSection => (
                <FormSection
                  formSection={formSection}
                  key={formSection.unique_id}
                />
              ))}
            </TabPanel>
            <TabPanel tab={tab} index={1}>
              Item Two
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
