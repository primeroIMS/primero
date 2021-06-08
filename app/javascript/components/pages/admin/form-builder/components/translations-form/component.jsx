import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { FormSectionField, FieldRecord, TEXT_FIELD, SELECT_FIELD, whichFormMode } from "../../../../../form";
import { useI18n } from "../../../../../i18n";
import { localesToRender } from "../utils";
import { getSelectedFields } from "../../selectors";
import { useMemoizedSelector } from "../../../../../../libs";
import WatchedFormSectionField from "../../../../../form/components/watched-form-section-field";
import { useApp } from "../../../../../application";

import { FieldTranslationRow } from "./components";
import { NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({ mode, formMethods }) => {
  const css = useStyles();
  const i18n = useI18n();
  const locales = localesToRender(i18n);
  const formMode = whichFormMode(mode);

  const { limitedProductionSite } = useApp();
  const [selectedLocaleId, setSelectedLocaleId] = useState(null);

  const fields = useMemoizedSelector(state => getSelectedFields(state, false));

  const { getValues, setValue } = formMethods;

  const selectedLocaleID = getValues("selected_locale_id");

  const onEnglishTextChange = event => {
    const { name, value } = event.target;

    setValue(name.replace("translations.", ""), value, { shouldDirty: true });
  };

  const onLocaleIdChange = (methods, data) => {
    const localeId = data?.id || null;

    if (localeId !== selectedLocaleId) {
      setSelectedLocaleId(localeId);
    }
  };

  const renderFields = () => {
    return fields.map(field => (
      <FieldTranslationRow
        field={field}
        key={field.get("name")}
        selectedLocaleId={selectedLocaleID}
        formMethods={formMethods}
        formMode={formMode}
      />
    ));
  };

  const renderFormField = fieldName => {
    return locales.map(locale => {
      const localeId = locale.get("id");
      const showIf = value => localeId === value;

      return (
        <WatchedFormSectionField
          key={`translations.${fieldName}.${localeId}`}
          field={FieldRecord({
            display_name: "",
            name: `translations.${fieldName}.${localeId}`,
            type: TEXT_FIELD,
            watchedInputs: "selected_locale_id",
            showIf,
            forceShowIf: true,
            disabled: limitedProductionSite
          })}
          formMethods={formMethods}
          formMode={formMode}
        />
      );
    });
  };

  useEffect(() => {
    if (locales?.toSeq()?.size) {
      const localeId = locales?.first()?.get("id");

      setSelectedLocaleId(localeId);
      setValue("selected_locale_id", localeId, { shouldDirty: true });
    }
  }, []);

  const classes = clsx(css.fieldTitle, css.translationsRow);

  const onBlur = event => onEnglishTextChange(event);

  return (
    <>
      <FormSectionField
        field={FieldRecord({
          display_name: "Select language",
          name: "selected_locale_id",
          type: SELECT_FIELD,
          disableClearable: true,
          onChange: onLocaleIdChange,
          option_strings_text: locales
        })}
        formMethods={formMethods}
        formMode={formMode}
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

        <Grid item xs={12} md={3} className={classes}>
          {i18n.t("forms.title")}
        </Grid>
        <Grid item xs={12} md={3} className={css.translationsRow}>
          <FormSectionField
            field={FieldRecord({
              display_name: "",
              name: "translations.name.en",
              type: TEXT_FIELD,
              onBlur,
              disabled: limitedProductionSite
            })}
            formMethods={formMethods}
            formMode={formMode}
          />
        </Grid>
        <Grid item xs={12} md={3} className={css.translationsRow}>
          {renderFormField("name")}
        </Grid>
        <Grid item xs={12} md={3} />

        <Grid item xs={12} md={3} className={classes}>
          {i18n.t("forms.description")}
        </Grid>
        <Grid item xs={12} md={3} className={css.translationsRow}>
          <FormSectionField
            field={FieldRecord({
              display_name: "",
              name: "translations.description.en",
              type: TEXT_FIELD,
              onBlur,
              disabled: limitedProductionSite
            })}
            formMethods={formMethods}
            formMode={formMode}
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

Component.propTypes = {
  formMethods: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired
};

export default Component;
