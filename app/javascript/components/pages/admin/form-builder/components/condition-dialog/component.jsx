import { useCallback, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import CheckIcon from "@material-ui/icons/Check";
import isNil from "lodash/isNil";

import { whichFormMode, FormSection } from "../../../../../form";
import ActionDialog, { useDialog } from "../../../../../action-dialog";
import { reduceMapToObject, useMemoizedSelector } from "../../../../../../libs";
import { useI18n } from "../../../../../i18n";
import { getFieldByName, getRecordFields } from "../../../../../record-form/selectors";
import { MODULES_FIELD, RECORD_TYPE_FIELD } from "../../constants";

import { conditionsForm, validationSchema } from "./form";
import { ATTRIBUTE_FIELD, FORM_NAME, NAME } from "./constants";

function Component({ formMethods, conditionsFieldName = "display_conditions" }) {
  const i18n = useI18n();
  const { append } = useFieldArray({ control: formMethods.control, name: conditionsFieldName });
  const { dialogOpen, dialogClose, params } = useDialog(NAME);
  const initialValues = reduceMapToObject(params.get("initialValues", {}));
  const dialogFormMethods = useForm({ defaultValues: initialValues, resolver: yupResolver(validationSchema(i18n)) });
  const { handleSubmit } = dialogFormMethods;
  const attribute = useWatch({ control: dialogFormMethods.control, name: ATTRIBUTE_FIELD });
  const recordType = useWatch({ control: formMethods.control, name: RECORD_TYPE_FIELD });
  const primeroModule = useWatch({ control: formMethods.control, name: MODULES_FIELD });
  const selectedField = useMemoizedSelector(state => getFieldByName(state, attribute));
  const fields = useMemoizedSelector(state =>
    getRecordFields(state, { recordType, primeroModule, includeNested: false, includeSeparators: false })
  );
  const formMode = whichFormMode(params.get("mode"));

  const handleClose = useCallback(() => {
    dialogClose();
  }, []);

  const formSections = conditionsForm({ fields, i18n, selectedField });

  const onSubmit = data => {
    if (formMode.isNew) {
      append(data);
    } else {
      formMethods.setValue(`${conditionsFieldName}.${params.get("index")}.constraint`, data.constraint, {
        shouldTouch: true,
        shouldDirty: true
      });
      formMethods.setValue(`${conditionsFieldName}.${params.get("index")}.attribute`, data.attribute, {
        shouldTouch: true,
        shouldDirty: true
      });
      formMethods.setValue(`${conditionsFieldName}.${params.get("index")}.value`, data.value, {
        shouldTouch: true,
        shouldDirty: true
      });
    }
    handleClose();
  };

  useEffect(() => {
    dialogFormMethods.reset(initialValues);
  }, [JSON.stringify(initialValues)]);

  useEffect(() => {
    if (formMethods.register && !isNil(params.get("index"))) {
      formMethods.register(`${conditionsFieldName}.${params.get("index")}.constraint`);
      formMethods.register(`${conditionsFieldName}.${params.get("index")}.attribute`);
      formMethods.register(`${conditionsFieldName}.${params.get("index")}.value`);
    }
  }, [formMethods.register, params.get("index")]);

  return (
    <ActionDialog
      open={dialogOpen}
      confirmButtonLabel={formMode.isNew ? i18n.t("buttons.add") : i18n.t("buttons.update")}
      confirmButtonProps={{
        icon: <CheckIcon />,
        form: FORM_NAME,
        type: "submit"
      }}
      dialogTitle="Add condition"
      omitCloseAfterSuccess
      cancelHandler={handleClose}
    >
      <form id={FORM_NAME} onSubmit={handleSubmit(onSubmit)}>
        {formSections.map(formSection => (
          <FormSection
            formSection={formSection}
            key={formSection.unique_id}
            formMode={formMode}
            formMethods={dialogFormMethods}
          />
        ))}
      </form>
    </ActionDialog>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  conditionsFieldName: PropTypes.string,
  formMethods: PropTypes.object
};

export default Component;
