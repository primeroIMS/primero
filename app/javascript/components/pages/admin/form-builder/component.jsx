import React, { useState } from "react";
import { Tab, Tabs } from "@material-ui/core";
import { useForm, FormContext } from "react-hook-form";
import { fromJS } from "immutable";

import { useI18n } from "../../../i18n";
import { PageHeading, PageContent } from "../../../page";
import FormSection from "../../../form/components/form-section";

import { settingsForm } from "./forms";
import TabPanel from "./components/tab-panel";
import { NAME } from "./constants";

const Component = () => {
  const i18n = useI18n();
  const [tab, setTab] = useState(0);
  const methods = useForm();

  const handleChange = (event, selectedTab) => {
    setTab(selectedTab);
  };

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <>
      <PageHeading title={i18n.t("forms.add_form")} />
      <PageContent>
        <FormContext
          {...methods}
          formMode={fromJS({ isShow: false, isEdit: false, isNew: true })}
        >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
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

Component.propTypes = {};

export default Component;
