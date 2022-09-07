import { memo, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import { useWatch } from "react-hook-form";

import { getObjectPath } from "../../../../../../libs";
import { setDialog } from "../../../../../action-dialog";
import FormTranslationsDialog from "../form-translations-dialog";
import TabPanel from "../tab-panel";
import { NAME as FormTranslationsDialogName } from "../form-translations-dialog/constants";
import css from "../../styles.css";
import { whichFormMode } from "../../../../../form";
import SettingsForm from "../settings-form";
import SkipLogic from "../skip-logic";

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

  const skipLogic = useWatch({ control: formMethods.control, name: "skip_logic" });

  const onManageTranslation = useCallback(() => {
    dispatch(setDialog({ dialog: FormTranslationsDialogName, open: true }));
  }, []);

  const onEnglishTextChange = useCallback(event => {
    const { name, value } = event.target;

    setValue(`translations.${name}`, value, { shouldDirty: true });
  }, []);

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
        {skipLogic && <SkipLogic formMethods={formMethods} />}
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
