import React, { useState, useRef, useImperativeHandle, useEffect } from "react";
import PropTypes from "prop-types";
import { Tab, Tabs } from "@material-ui/core";
import { useForm, FormContext } from "react-hook-form";
import { push } from "connected-react-router";
import { fromJS } from "immutable";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import { useI18n } from "../../../i18n";
import { PageHeading, PageContent } from "../../../page";
import FormSection from "../../../form/components/form-section";
import { FormAction, whichFormMode, submitHandler } from "../../../form";
import bindFormSubmit from "../../../../libs/submit-form";
import { ROUTES, SAVE_METHODS } from "../../../../config";

import { saveForm } from "./action-creators";
import { settingsForm, validationSchema } from "./forms";
import TabPanel from "./components/tab-panel";
import { NAME } from "./constants";

const Component = ({ mode }) => {
  const { id } = useParams();
  const formMode = whichFormMode(mode);
  const formRef = useRef();
  const dispatch = useDispatch();
  const i18n = useI18n();
  const [tab, setTab] = useState(0);
  const methods = useForm({ validationSchema, defaultValues: {} });

  // const saving = useSelector(state => getSavingRecord(state));

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

  const saveButton = (formMode.get("isEdit") || formMode.get("isNew")) && (
    <>
      <FormAction
        cancel
        actionHandler={handleCancel}
        text={i18n.t("buttons.cancel")}
        startIcon={<CloseIcon />}
      />
      <FormAction
        actionHandler={() => bindFormSubmit(formRef)}
        text={i18n.t("buttons.save")}
        startIcon={<CheckIcon />}
        // savingRecord={saving}
      />
    </>
  );

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
      <PageHeading title={i18n.t("forms.add")}>{saveButton}</PageHeading>
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
