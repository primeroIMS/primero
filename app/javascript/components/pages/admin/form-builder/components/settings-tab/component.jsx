// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { memo, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useWatch } from "react-hook-form";
import get from "lodash/get";

import { getObjectPath } from "../../../../../../libs";
import { setDialog, useDialog } from "../../../../../action-dialog";
import FormTranslationsDialog from "../form-translations-dialog";
import TabPanel from "../tab-panel";
import { NAME as FormTranslationsDialogName } from "../form-translations-dialog/constants";
import css from "../../styles.css";
import { whichFormMode } from "../../../../../form";
import SettingsForm from "../settings-form";
import SkipLogic from "../skip-logic";
import { NAME as CONDITIONS_DIALOG } from "../condition-dialog/constants";
import { MODULES_FIELD, RECORD_TYPE_FIELD, SKIP_LOGIC_FIELD } from "../../constants";

import { NAME } from "./constants";

const Component = ({ index, mode, tab, formMethods, limitedProductionSite }) => {
  const dispatch = useDispatch();
  const formMode = whichFormMode(mode);

  const {
    reset,
    register,
    setValue,
    getValues,
    control: {
      fieldsRef: { current: fields }
    }
  } = formMethods;

  const { dialogClose } = useDialog(CONDITIONS_DIALOG);

  const skipLogic = useWatch({ control: formMethods.control, name: SKIP_LOGIC_FIELD });
  const recordType = useWatch({ control: formMethods.control, name: RECORD_TYPE_FIELD });
  const primeroModule = useWatch({ control: formMethods.control, name: MODULES_FIELD });

  const onManageTranslation = useCallback(() => {
    dispatch(setDialog({ dialog: FormTranslationsDialogName, open: true }));
  }, []);

  const onEnglishTextChange = useCallback(event => {
    const { name, value } = event.target;

    setValue(name, value, { shouldDirty: true });
  }, []);

  const onUpdateTranslation = data => {
    getObjectPath("", data).forEach(path => {
      if (!fields[path]) {
        register({ name: path });
      }

      const value = get(data, path);

      setValue(path, value, { shouldDirty: true });
    });
  };

  const handleClose = useCallback(() => {
    dialogClose();
  }, []);

  const getFormValues = useCallback(props => getValues(props), []);
  const formReset = useCallback(props => reset(props), []);

  return (
    <TabPanel tab={tab} index={index}>
      <div className={css.tabContent}>
        <SettingsForm
          formMethods={formMethods}
          formMode={formMode}
          onManageTranslation={onManageTranslation}
          onEnglishTextChange={onEnglishTextChange}
          limitedProductionSite={limitedProductionSite}
        />
        {skipLogic && (
          <SkipLogic
            formMethods={formMethods}
            handleClose={handleClose}
            recordType={recordType}
            primeroModule={primeroModule}
          />
        )}
      </div>
      <FormTranslationsDialog mode={mode} getValues={getFormValues} onSuccess={onUpdateTranslation} reset={formReset} />
    </TabPanel>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  formMethods: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  limitedProductionSite: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  tab: PropTypes.number.isRequired
};

export default memo(Component);
