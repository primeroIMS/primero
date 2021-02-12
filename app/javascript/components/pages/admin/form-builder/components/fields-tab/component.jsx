import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

import { useI18n } from "../../../../../i18n";
import TabPanel from "../tab-panel";
import FieldsList from "../fields-list";
import FieldDialog from "../field-dialog";
import CustomFieldDialog from "../custom-field-dialog";
import ExistingFieldDialog from "../existing-field-dialog";
import { setFieldDataInFormContext } from "../utils";
import styles from "../../styles.css";
import { useApp } from "../../../../../application";

import { NAME } from "./constants";

const Component = ({ fieldDialogMode, formContextFields, getValues, index, register, setValue, tab, unregister }) => {
  const { id } = useParams();
  const { limitedProductionSite } = useApp();
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const { parent_form: parentForm, module_ids: moduleIds } = getValues({ nest: true });
  const moduleId = moduleIds ? moduleIds[0] : null;

  const onSuccess = useCallback(data => {
    Object.entries(data).forEach(([fieldName, fieldData]) => {
      setFieldDataInFormContext({
        name: fieldName,
        data: fieldData,
        contextFields: formContextFields,
        register,
        setValue
      });
    });
  }, []);

  return (
    <TabPanel tab={tab} index={index}>
      <div className={css.tabFields}>
        <h1 className={css.heading}>{i18n.t("forms.fields")}</h1>
        <CustomFieldDialog limitedProductionSite={limitedProductionSite} />
        {parentForm && moduleId && <ExistingFieldDialog parentForm={parentForm} primeroModule={moduleId} />}
      </div>
      <FieldsList
        formContextFields={formContextFields}
        getValues={getValues}
        register={register}
        setValue={setValue}
        unregister={unregister}
      />
      <FieldDialog mode={fieldDialogMode} onSuccess={onSuccess} formId={id} />
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
  tab: PropTypes.number.isRequired,
  unregister: PropTypes.func.isRequired
};

Component.whyDidYouRender = true;

export default React.memo(Component);
