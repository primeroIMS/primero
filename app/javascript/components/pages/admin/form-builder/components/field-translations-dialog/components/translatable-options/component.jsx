/* eslint-disable react/no-multi-comp, react/display-name */
import { Fragment } from "react";
import { Grid } from "@material-ui/core";
import { fromJS } from "immutable";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import { useI18n } from "../../../../../../../i18n";
import { FieldRecord, FormSectionField, TEXT_FIELD } from "../../../../../../../form";
import { LOCALE_KEYS } from "../../../../../../../../config";
import styles from "../../../styles.css";

import { NAME } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({ field, selectedLocaleId, formMode, formMethods }) => {
  const css = useStyles();
  const i18n = useI18n();
  const locales = i18n.applicationLocales.filter(locale => locale.id !== LOCALE_KEYS.en);

  const englishOptions = field.get("option_strings_text") || fromJS([]);
  const englishOptionsSize = englishOptions.reduce(
    (acc, curr) => acc + !!curr.getIn(["display_text", LOCALE_KEYS.en]),
    0
  );

  if (!englishOptionsSize) {
    return null;
  }

  const renderLocalizedOption = (localeId, index, option, hideField) => (
    <Fragment key={`${localeId}-${option.get("id")}`}>
      <FormSectionField
        field={FieldRecord({
          display_name: "",
          name: `${field.get("name")}.option_strings_text[${index}].id`,
          type: TEXT_FIELD,
          inputClassname: css.hideField
        })}
        formMethods={formMethods}
        formMode={formMode}
      />
      <FormSectionField
        field={FieldRecord({
          display_name: "",
          name: `${field.get("name")}.option_strings_text[${index}].display_text.${localeId}`,
          type: TEXT_FIELD,
          disabled: localeId === LOCALE_KEYS.en,
          inputClassname: hideField ? css.hideField : null
        })}
        formMethods={formMethods}
        formMode={formMode}
      />
    </Fragment>
  );

  const renderEnglishOptions = () =>
    englishOptions.map((option, index) => renderLocalizedOption(LOCALE_KEYS.en, index, option, false));

  const renderOptions = () =>
    englishOptions.map((option, index) =>
      locales
        .map(locale => locale.id)
        .map(localeId => renderLocalizedOption(localeId, index, option, localeId !== selectedLocaleId))
    );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={12}>
        <h1>{i18n.t("fields.option_strings_text")}</h1>
      </Grid>
      <Grid item xs={12} md={6}>
        <h1 className={css.translationHeader}>{i18n.t("fields.english_text")}</h1>
        {renderEnglishOptions()}
      </Grid>
      <Grid item xs={12} md={6}>
        <h1 className={css.translationHeader}>{i18n.t("fields.translation_text")}</h1>
        {renderOptions()}
      </Grid>
    </Grid>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  field: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired,
  formMode: PropTypes.object.isRequired,
  selectedLocaleId: PropTypes.string
};

export default Component;
