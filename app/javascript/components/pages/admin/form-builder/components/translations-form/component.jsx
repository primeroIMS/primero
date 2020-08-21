import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import clsx from "clsx";

import { FormSectionField, FieldRecord, TEXT_FIELD, SELECT_FIELD } from "../../../../../form";
import { useI18n } from "../../../../../i18n";
import { localesToRender } from "../utils";
import { getSelectedFields } from "../../selectors";
import { compare } from "../../../../../../libs";

import { FieldTranslationRow } from "./components";
import { NAME } from "./constants";
import styles from "./styles.css";

const Component = () => {
  const css = makeStyles(styles)();
  const formMethods = useFormContext();
  const i18n = useI18n();
  const locales = localesToRender(i18n);
  const fields = useSelector(state => getSelectedFields(state, false), compare);
  const selectedLocaleId = formMethods.watch("selected_locale_id");

  const onEnglishTextChange = event => {
    const { name, value } = event.target;

    formMethods.setValue(name.replace("translations.", ""), value);
  };

  const renderFields = () =>
    fields.map(field => (
      <FieldTranslationRow field={field} key={field.get("name")} selectedLocaleId={selectedLocaleId} />
    ));

  const renderFormField = fieldName =>
    locales.map(locale => {
      const localeId = locale.get("id");
      const inputClassname = localeId !== selectedLocaleId ? css.hideField : "";

      return (
        <FormSectionField
          key={`translations.${fieldName}.${localeId}`}
          field={FieldRecord({
            display_name: "",
            name: `translations.${fieldName}.${localeId}`,
            type: TEXT_FIELD,
            inputClassname
          })}
        />
      );
    });

  useEffect(() => {
    if (locales?.toSeq()?.size) {
      formMethods.setValue("selected_locale_id", locales?.first()?.get("id"));
    }
  }, [i18n]);

  useEffect(() => {
    // When fields are new the inputs are not registered so we need to set the values again or they will not be visible.
    fields.forEach(field => {
      const displayName = field.getIn(["display_name", "en"]);

      formMethods.setValue(`fields.${field.get("name")}.display_name.en`, displayName);
    });
  }, [fields]);

  return (
    <>
      <FormSectionField
        field={FieldRecord({
          display_name: "Select language",
          name: "selected_locale_id",
          type: SELECT_FIELD,
          disableClearable: true,
          option_strings_text: locales.toJS()
        })}
      />
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <h1>{i18n.t("forms.label")}</h1>
        </Grid>
        <Grid item xs={12} md={3} className={css.header}>
          {i18n.t("fields.detail")}
        </Grid>
        <Grid item xs={12} md={3} className={css.header}>
          {i18n.t("fields.english_text")}
        </Grid>
        <Grid item xs={12} md={3} className={css.header}>
          {i18n.t("fields.translation_text")}
        </Grid>
        <Grid item xs={12} md={3} />

        <Grid item xs={12} md={3} className={clsx(css.fieldTitle, css.translationsRow)}>
          {i18n.t("forms.title")}
        </Grid>
        <Grid item xs={12} md={3} className={css.translationsRow}>
          <FormSectionField
            field={FieldRecord({
              display_name: "",
              name: "translations.name.en",
              type: TEXT_FIELD,
              onBlur: e => onEnglishTextChange(e)
            })}
          />
        </Grid>
        <Grid item xs={12} md={3} className={css.translationsRow}>
          {renderFormField("name")}
        </Grid>
        <Grid item xs={12} md={3} />

        <Grid item xs={12} md={3} className={clsx(css.fieldTitle, css.translationsRow)}>
          {i18n.t("forms.description")}
        </Grid>
        <Grid item xs={12} md={3} className={css.translationsRow}>
          <FormSectionField
            field={FieldRecord({
              display_name: "",
              name: "translations.description.en",
              type: TEXT_FIELD,
              onBlur: e => onEnglishTextChange(e)
            })}
          />
        </Grid>
        <Grid item xs={12} md={3} className={css.translationsRow}>
          {renderFormField("description")}
        </Grid>
        <Grid item xs={12} md={3} />
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <h1>{i18n.t("fields.label")}</h1>
        </Grid>
        <Grid item xs={12} md={3} className={css.header}>
          {i18n.t("fields.detail")}
        </Grid>
        <Grid item xs={12} md={3} className={css.header}>
          {i18n.t("fields.english_text")}
        </Grid>
        <Grid item xs={12} md={3} className={css.header}>
          {i18n.t("fields.translation_text")}
        </Grid>
        <Grid item xs={12} md={3} />
        {renderFields()}
      </Grid>
    </>
  );
};

Component.displayName = NAME;

export default Component;
