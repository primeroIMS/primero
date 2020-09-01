/* eslint-disable react/display-name, react/no-multi-comp */
import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import get from "lodash/get";

import { useI18n } from "../../../../../i18n";
import { SUBFORM_SECTION } from "../../../../../form";
import { getObjectPath } from "../../../../../../libs";
import { selectDialog } from "../../../../../record-actions/selectors";
import { updateSelectedSubform } from "../../action-creators";
import TabPanel from "../tab-panel";
import FieldTranslationsDialog, { NAME as FieldTranslationsDialogName } from "../field-translations-dialog";
import TranslationsNote from "../translations-note";
import TranslationsForm from "../translations-form";
import styles from "../../styles.css";

import { NAME } from "./constants";

const Component = ({
  formContextFields,
  getValues,
  index,
  mode,
  moduleId,
  parentForm,
  register,
  selectedField,
  setValue,
  tab
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const openFieldTranslationsDialog = useSelector(state => selectDialog(state, FieldTranslationsDialogName));

  const onUpdateFieldTranslations = data => {
    if (selectedField.get("type") !== SUBFORM_SECTION) {
      getObjectPath("", data).forEach(path => {
        const name = `fields.${path}`;

        if (!formContextFields[path]) {
          register({ name });
        }

        setValue(name, get(data, path));
      });
    } else {
      const fieldData = { [selectedField.get("name")]: { display_name: data.subform_section.name } };

      getObjectPath("", fieldData).forEach(path => {
        setValue(`fields.${path}`, get(fieldData, path));
      });

      dispatch(updateSelectedSubform(data.subform_section));
    }
  };

  const renderTranslationsDialog = () => {
    const openDialog = tab === 2 && selectedField?.toSeq()?.size && openFieldTranslationsDialog;

    const fieldValues = getValues({ nest: true }).fields;

    return openDialog ? (
      <FieldTranslationsDialog
        mode={mode}
        open={openDialog}
        field={selectedField}
        currentValues={fieldValues}
        onSuccess={onUpdateFieldTranslations}
      />
    ) : null;
  };

  return (
    <TabPanel tab={tab} index={index}>
      <div className={css.tabTranslations}>
        <h1 className={css.heading}>{i18n.t("forms.translations.title")}</h1>
        <TranslationsNote moduleId={moduleId} parentForm={parentForm} />
        <TranslationsForm mode={mode} getValues={getValues} setValue={setValue} />
        {renderTranslationsDialog()}
      </div>
    </TabPanel>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  formContextFields: PropTypes.object.isRequired,
  getValues: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  mode: PropTypes.string.isRequired,
  moduleId: PropTypes.string.isRequired,
  parentForm: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  selectedField: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  tab: PropTypes.number.isRequired
};

Component.whyDidYouRender = true;

export default React.memo(Component);
