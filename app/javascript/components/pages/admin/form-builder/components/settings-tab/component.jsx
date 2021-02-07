import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import get from "lodash/get";
import { isEqual } from "lodash";

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

const Component = ({ index, mode, tab, formMethods }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const formMode = whichFormMode(mode);

  const allFormGroupsLookups = useSelector(state => getFormGroupLookups(state), isEqual);

  const {
    register,
    setValue,
    getValues,
    control: {
      fieldsRef: { current: fields }
    }
  } = formMethods;

  const onManageTranslation = () => {
    dispatch(setDialog({ dialog: FormTranslationsDialogName, open: true }));
  };

  const onUpdateTranslation = data => {
    getObjectPath("", data).forEach(path => {
      if (!fields[path]) {
        register({ name: path });
      }

      const value = get(data, path);

      setValue(`translations.${path}`, value, { shouldDirty: true });
      setValue(path, value, { shouldDirty: true });
    });
  };

  const onEnglishTextChange = event => {
    const { name, value } = event.target;

    setValue(`translations.${name}`, value, { shouldDirty: true });
  };

  const renderForms = settingsForm({
    formMode,
    onManageTranslation,
    onEnglishTextChange,
    i18n,
    allFormGroupsLookups
  }).map(formSection => (
    <FormSection formSection={formSection} key={formSection.unique_id} formMethods={formMethods} formMode={formMode} />
  ));

  const getFormValues = useCallback(props => getValues(props), []);

  return (
    <TabPanel tab={tab} index={index}>
      <div className={css.tabContent}>{renderForms}</div>
      <FormTranslationsDialog mode={mode} getValues={getFormValues} onSuccess={onUpdateTranslation} />
    </TabPanel>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  formMethods: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  mode: PropTypes.string.isRequired,
  tab: PropTypes.number.isRequired
};

Component.whyDidYouRender = true;

export default React.memo(Component);
