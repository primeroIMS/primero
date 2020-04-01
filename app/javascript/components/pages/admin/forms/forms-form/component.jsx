import React, { useState } from "react";
import PropTypes from "prop-types";
import { Tab, Tabs, Paper } from "@material-ui/core";
import { useForm, FormContext } from "react-hook-form";
import { fromJS } from "immutable";
import { makeStyles } from "@material-ui/styles";

import {
  FieldRecord,
  FormSectionRecord,
  TEXT_FIELD,
  SELECT_FIELD,
  CHECK_BOX_FIELD
} from "../../../../form";
import { useI18n } from "../../../../i18n";
import { PageHeading, PageContent } from "../../../../page";
import FormSection from "../../../../form/components/form-section";

import styles from "./styles.css";

const TabPanel = ({ tab, index, children }) => {
  const css = makeStyles(styles)();

  // TODO: Will have to hide with css instead of return false because for form lib
  if (tab !== index) return false;

  return (
    <Paper elevation={3} className={css.tabContainer}>
      {children}
    </Paper>
  );
};

const settingsForm = i18n =>
  fromJS([
    FormSectionRecord({
      unique_id: "agencies",
      name: i18n.t("forms.settings"),
      fields: [
        FieldRecord({
          display_name: i18n.t("forms.title"),
          name: "title",
          type: TEXT_FIELD,
          required: true,
          help_text: i18n.t("forms.help_text.must_be_english")
        }),
        FieldRecord({
          display_name: i18n.t("forms.description"),
          name: "description",
          type: TEXT_FIELD,
          required: true,
          help_text: i18n.t("forms.help_text.summariaze_purpose")
        }),
        FieldRecord({
          display_name: i18n.t("forms.form_group"),
          name: "form_group",
          type: SELECT_FIELD,
          required: true,
          help_text: i18n.t("forms.help_text.related_groups"),
          freeSolo: true
        }),
        [
          FieldRecord({
            display_name: i18n.t("forms.record_type"),
            name: "record_type",
            type: SELECT_FIELD,
            option_strings_source: "lookup-service-type",
            required: true
          }),
          FieldRecord({
            display_name: i18n.t("forms.module"),
            name: "module",
            type: SELECT_FIELD,
            option_strings_source: "lookup-service-type",
            required: true
          })
        ]
      ]
    }),
    FormSectionRecord({
      unique_id: "agencies",
      name: i18n.t("forms.visibility"),
      fields: [
        FieldRecord({
          display_name: i18n.t("forms.show_on"),
          name: "title",
          type: CHECK_BOX_FIELD,
          required: true,
          inlineCheckboxes: true,
          option_strings_source: "lookup-service-type"
        })
      ]
    })
  ]);

// TODO: Rename all this stuff FormBuilder? FormsForm is stupid
const Component = props => {
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

Component.displayName = "FormsForm";

Component.propTypes = {};

export default Component;
