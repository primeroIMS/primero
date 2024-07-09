// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/display-name, react/no-multi-comp */
import { memo, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import get from "lodash/get";

import { useI18n } from "../../../../../i18n";
import { SUBFORM_SECTION } from "../../../../../form";
import { getObjectPath } from "../../../../../../libs";
import { useDialog } from "../../../../../action-dialog";
import { updateFieldTranslations, updateSelectedSubform } from "../../action-creators";
import TabPanel from "../tab-panel";
import FieldTranslationsDialog, { NAME as FieldTranslationsDialogName } from "../field-translations-dialog";
import TranslationsNote from "../translations-note";
import TranslationsForm from "../translations-form";
import css from "../../styles.css";

import { NAME } from "./constants";

function Component({ index, mode, moduleId, parentForm, selectedField, tab, formMethods }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { dialogOpen } = useDialog(FieldTranslationsDialogName);

  const {
    register,
    setValue,
    getValues,
    control: {
      fieldsRef: { current: fields }
    }
  } = formMethods;

  const onUpdateFieldTranslations = data => {
    if (selectedField.get("type") !== SUBFORM_SECTION) {
      getObjectPath("", data).forEach(path => {
        const name = `fields.${path}`;

        if (!fields[name]) {
          register({ name });
        }

        setValue(name, get(data, path), { shouldDirty: true });
      });
    } else {
      const fieldData = { [selectedField.get("name")]: { display_name: data.subform_section.name } };

      getObjectPath("", fieldData).forEach(path => {
        setValue(`fields.${path}`, get(fieldData, path, { shouldDirty: true }));
      });

      dispatch(updateSelectedSubform(data.subform_section));
    }
  };

  const renderTranslationsDialog = () => {
    const openDialog = tab === 2 && selectedField?.toSeq()?.size && dialogOpen;

    const fieldValues = getValues({ nest: true }).fields;

    return openDialog ? (
      <FieldTranslationsDialog
        mode={mode}
        open={dialogOpen}
        field={selectedField}
        currentValues={fieldValues}
        onSuccess={onUpdateFieldTranslations}
      />
    ) : null;
  };

  useEffect(() => {
    return () => {
      const currentValues = formMethods.getValues({ nest: true });

      dispatch(updateFieldTranslations(currentValues.fields || {}));
    };
  }, []);

  return (
    <TabPanel tab={tab} index={index}>
      <div className={css.tabTranslations}>
        <h1 className={css.heading}>{i18n.t("forms.translations.title")}</h1>
        <TranslationsNote moduleId={moduleId} parentForm={parentForm} />
        <TranslationsForm mode={mode} formMethods={formMethods} />
        {renderTranslationsDialog()}
      </div>
    </TabPanel>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  formMethods: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  mode: PropTypes.string.isRequired,
  moduleId: PropTypes.string.isRequired,
  parentForm: PropTypes.string.isRequired,
  selectedField: PropTypes.object.isRequired,
  tab: PropTypes.number.isRequired
};

export default memo(Component);
