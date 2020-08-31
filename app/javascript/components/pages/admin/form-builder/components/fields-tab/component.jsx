import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import get from "lodash/get";
import PropTypes from "prop-types";

import { useI18n } from "../../../../../i18n";
import { getObjectPath } from "../../../../../../libs";
import { transformValues } from "../field-dialog/utils";
import TabPanel from "../tab-panel";
import FieldsList from "../fields-list";
import FieldDialog from "../field-dialog";
import CustomFieldDialog from "../custom-field-dialog";
import styles from "../../styles.css";

import { NAME } from "./constants";

const Component = ({ fieldDialogMode, formContextFields, getValues, index, register, setValue, tab }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const onSuccess = useCallback(data => {
    Object.entries(data).forEach(([fieldName, fieldData]) => {
      const transformedFieldValues = transformValues(fieldData, true);

      getObjectPath("", transformedFieldValues).forEach(path => {
        const isDisabledProp = path.endsWith("disabled");
        const value = get(transformedFieldValues, path);
        const fieldFullPath = `fields.${fieldName}.${path}`;

        if (!path.startsWith("display_name")) {
          if (!formContextFields[fieldFullPath]) {
            register({ name: fieldFullPath });
          }

          setValue(fieldFullPath, isDisabledProp ? !value : value);
        }
      });
    });
  }, []);

  return (
    <TabPanel tab={tab} index={index}>
      <div className={css.tabFields}>
        <h1 className={css.heading}>{i18n.t("forms.fields")}</h1>
        <CustomFieldDialog />
      </div>
      <FieldsList formContextFields={formContextFields} getValues={getValues} register={register} setValue={setValue} />
      <FieldDialog mode={fieldDialogMode} onSuccess={onSuccess} />
    </TabPanel>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  fieldDialogMode: PropTypes.string.isRequired,
  formContextFields: PropTypes.object.isRequired,
  getValues: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  tab: PropTypes.number.isRequired
};

Component.whyDidYouRender = true;

export default React.memo(Component);
