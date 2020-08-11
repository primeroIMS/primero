/* eslint-disable react/no-multi-comp, react/display-name */
import React from "react";
import { Grid } from "@material-ui/core";
import { fromJS } from "immutable";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import { useI18n } from "../../../../../../../i18n";
import {
  FieldRecord,
  FormSectionField,
  TEXT_FIELD
} from "../../../../../../../form";
import { LOCALE_KEYS } from "../../../../../../../../config";
import styles from "../../../styles.css";

import { NAME } from "./constants";

const Component = ({ field, selectedLocaleId }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const locales = i18n.applicationLocales.filter(
    locale => locale.get("id") !== LOCALE_KEYS.en
  );
  const englishOptions = field.getIn(
    ["option_strings_text", LOCALE_KEYS.en],
    fromJS([])
  );

  if (!englishOptions?.size) {
    return null;
  }

  const renderLocalizedOption = (id, index, option, hideField) => (
    <React.Fragment key={`${id}-${option.get("id")}`}>
      <FormSectionField
        field={FieldRecord({
          display_name: "",
          name: `${field.get("name")}.option_strings_text.${id}[${index}].id`,
          type: TEXT_FIELD,
          inputClassname: css.hideField
        })}
      />
      <FormSectionField
        field={FieldRecord({
          display_name: "",
          name: `${field.get(
            "name"
          )}.option_strings_text.${id}[${index}].display_text`,
          type: TEXT_FIELD,
          disabled: id === LOCALE_KEYS.en,
          inputClassname: hideField ? css.hideField : null
        })}
      />
    </React.Fragment>
  );

  const renderEnglishOptions = () =>
    englishOptions.map((option, index) =>
      renderLocalizedOption(LOCALE_KEYS.en, index, option, false)
    );

  const renderOptions = () =>
    englishOptions.map((option, index) =>
      locales
        .map(locale => locale.get("id"))
        .map(localeId =>
          renderLocalizedOption(
            localeId,
            index,
            option,
            localeId !== selectedLocaleId
          )
        )
    );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={12}>
        <h1>{i18n.t("fields.option_strings_text")}</h1>
      </Grid>
      <Grid item xs={12} md={6}>
        <h1 className={css.translationHeader}>
          {i18n.t("fields.english_text")}
        </h1>
        {renderEnglishOptions()}
      </Grid>
      <Grid item xs={12} md={6}>
        <h1 className={css.translationHeader}>
          {i18n.t("fields.translation_text")}
        </h1>
        {renderOptions()}
      </Grid>
    </Grid>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  field: PropTypes.object.isRequired,
  selectedLocaleId: PropTypes.string
};

export default Component;
