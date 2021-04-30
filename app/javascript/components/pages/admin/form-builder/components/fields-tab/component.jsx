import { memo, useCallback } from "react";
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

const useStyles = makeStyles(styles);

const Component = ({ mode, index, tab, formMethods }) => {
  const { id } = useParams();
  const { limitedProductionSite } = useApp();
  const css = useStyles();
  const i18n = useI18n();
  const {
    getValues,
    register,
    setValue,
    control: {
      fieldsRef: { current: fields }
    }
  } = formMethods;
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
      <FieldDialog mode={mode} onSuccess={onSuccess} formId={id} />
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
