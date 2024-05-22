// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { memo, useCallback } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useWatch } from "react-hook-form";

import { useI18n } from "../../../../../i18n";
import TabPanel from "../tab-panel";
import FieldsList from "../fields-list";
import FieldDialog from "../field-dialog";
import CustomFieldDialog from "../custom-field-dialog";
import ExistingFieldDialog from "../existing-field-dialog";
import { setFieldDataInFormContext } from "../utils";
import css from "../../styles.css";
import { useApp } from "../../../../../application";
import { MODULES_FIELD, RECORD_TYPE_FIELD } from "../../constants";

import { NAME } from "./constants";

const Component = ({ mode, index, tab, formMethods }) => {
  const { id } = useParams();
  const { limitedProductionSite } = useApp();

  const i18n = useI18n();
  const {
    getValues,
    register,
    setValue,
    control: {
      fieldsRef: { current: fields }
    }
  } = formMethods;

  const recordType = useWatch({ control: formMethods.control, name: RECORD_TYPE_FIELD });
  const primeroModule = useWatch({ control: formMethods.control, name: MODULES_FIELD });

  const { parent_form: parentForm, module_ids: moduleIds } = getValues({ nest: true });
  const moduleId = moduleIds ? moduleIds[0] : null;

  const onSuccess = useCallback(
    data => {
      Object.entries(data).forEach(([fieldName, fieldData]) => {
        setFieldDataInFormContext({
          name: fieldName,
          data: fieldData,
          contextFields: fields,
          register,
          setValue
        });
      });
    },
    [register]
  );

  return (
    <TabPanel tab={tab} index={index}>
      <div className={css.tabFields}>
        <h1 className={css.heading}>{i18n.t("forms.fields")}</h1>
        <CustomFieldDialog />
        {parentForm && moduleId && <ExistingFieldDialog parentForm={parentForm} primeroModule={moduleId} />}
      </div>
      <FieldsList formMethods={formMethods} limitedProductionSite={limitedProductionSite} />
      <FieldDialog
        parentForm={parentForm}
        mode={mode}
        onSuccess={onSuccess}
        formId={id}
        recordType={recordType}
        primeroModule={primeroModule}
      />
    </TabPanel>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  formMethods: PropTypes.object,
  index: PropTypes.number.isRequired,
  mode: PropTypes.string.isRequired,
  tab: PropTypes.number.isRequired
};

export default memo(Component);
