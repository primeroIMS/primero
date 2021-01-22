import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import get from "lodash/get";

import FormSection from "../../../../../form/components/form-section";
import { getObjectPath } from "../../../../../../libs";
import { useI18n } from "../../../../../i18n";
import { setDialog } from "../../../../../action-dialog";
import FormTranslationsDialog from "../form-translations-dialog";
import TabPanel from "../tab-panel";
import { NAME as FormTranslationsDialogName } from "../form-translations-dialog/constants";
import styles from "../../styles.css";
import { settingsForm } from "../../forms";
import { whichFormMode } from "../../../../../form";
import { getFormGroupLookups } from "../../../../../form/selectors";

import { NAME } from "./constants";

const Component = ({ formContextFields, getValues, index, mode, register, setValue, tab, prodSite }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const formMode = whichFormMode(mode);
  const allFormGroupsLookups = useSelector(state => getFormGroupLookups(state));

  const onManageTranslation = () => {
    dispatch(setDialog({ dialog: FormTranslationsDialogName, open: true }));
  };

  const onUpdateTranslation = data => {
    getObjectPath("", data).forEach(path => {
      if (!formContextFields[path]) {
        register({ name: path });
      }

      const value = get(data, path);

      setValue(`translations.${path}`, value);
      setValue(path, value);
    });
  };

  const onEnglishTextChange = event => {
    const { name, value } = event.target;

    setValue(`translations.${name}`, value);
  };

  const renderForms = settingsForm({
    formMode,
    onManageTranslation,
    onEnglishTextChange,
    i18n,
    allFormGroupsLookups,
    prodSite
  }).map(formSection => <FormSection formSection={formSection} key={formSection.unique_id} />);

  return (
    <TabPanel tab={tab} index={index}>
      <div className={css.tabContent}>{renderForms}</div>
      <FormTranslationsDialog mode={mode} getValues={getValues} onSuccess={onUpdateTranslation} />
    </TabPanel>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  formContextFields: PropTypes.object.isRequired,
  getValues: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  mode: PropTypes.string.isRequired,
  prodSite: PropTypes.bool,
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  tab: PropTypes.number.isRequired
};

Component.whyDidYouRender = true;

export default React.memo(Component);
