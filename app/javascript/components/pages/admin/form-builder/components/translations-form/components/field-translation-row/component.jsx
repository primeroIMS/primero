import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, batch } from "react-redux";
import clsx from "clsx";

import { NAME as FieldTranslationsDialogName } from "../../../field-translations-dialog";
import { setSelectedField, setSelectedSubform } from "../../../../action-creators";
import { setDialog } from "../../../../../../../action-dialog";
import { localesToRender } from "../../../utils";
import ActionButton from "../../../../../../../action-button";
import { FormSectionField, FieldRecord, SUBFORM_SECTION, TEXT_FIELD } from "../../../../../../../form";
import { useI18n } from "../../../../../../../i18n";
import styles from "../../styles.css";
import { useApp } from "../../../../../../../application";

import { NAME } from "./constants";

const Component = ({ field, selectedLocaleId, formMethods, formMode }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const { limitedProductionSite } = useApp();
  const locales = localesToRender(i18n);
  const dispatch = useDispatch();
  const displayName = field.getIn(["display_name", "en"], "");
  const fieldName = field.get("name");

  const renderTranslationFields = () =>
    locales.map(locale => {
      const localeId = locale.get("id");

      return (
        <FormSectionField
          key={`fields.${fieldName}.display_name.${localeId}`}
          field={FieldRecord({
            display_name: "",
            name: `fields.${fieldName}.display_name.${localeId}`,
            type: TEXT_FIELD,
            watchedInputs: "selected_locale_id",
            showIf: () => localeId === selectedLocaleId,
            forceShowIf: true
          })}
          formMode={formMode}
          formMethods={formMethods}
        />
      );
    });

  const onClickManage = () => {
    batch(() => {
      dispatch(setSelectedField(fieldName));
      if (field?.get("type") === SUBFORM_SECTION) {
        dispatch(setSelectedSubform({ id: field.get("subform_section_id") }));
      }
      dispatch(setDialog({ dialog: FieldTranslationsDialogName, open: true }));
    });
  };

  return (
    <>
      <Grid item xs={12} md={3} className={clsx(css.fieldTitle, css.translationsRow)}>
        {displayName}
      </Grid>
      <Grid item xs={12} md={3} className={css.translationsRow}>
        <FormSectionField
          field={FieldRecord({
            display_name: "",
            name: `fields.${fieldName}.display_name.en`,
            type: TEXT_FIELD
          })}
          formMode={formMode}
          formMethods={formMethods}
        />
      </Grid>
      <Grid item xs={12} md={3} className={css.translationsRow}>
        {renderTranslationFields()}
      </Grid>
      <Grid item xs={12} md={3} className={css.translationsRow}>
        <ActionButton
          text={i18n.t("forms.manage")}
          outlined
          rest={{ onClick: onClickManage, hide: limitedProductionSite }}
        />
      </Grid>
    </>
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
