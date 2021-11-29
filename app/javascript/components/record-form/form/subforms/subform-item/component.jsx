import PropTypes from "prop-types";

import { useI18n } from "../../../../i18n";
import SubformTraces from "../subform-traces";
import SubformDialog from "../subform-dialog";

import { buildFormViolations } from "./utils";
import { NAME } from "./constants";

const Component = ({
  arrayHelpers,
  dialogIsNew,
  field,
  formik,
  forms,
  formSection,
  index,
  isDisabled,
  isTraces,
  isReadWriteForm,
  isViolation,
  mode,
  open,
  orderedValues,
  recordModuleID,
  recordType,
  selectedValue,
  setOpen,
  title
}) => {
  const i18n = useI18n();
  const handleClose = () => setOpen(false);

  const fieldToRender = isViolation ? buildFormViolations(field.subform_section_id.fields, forms) : field;

  if (isTraces && mode.isShow) {
    return (
      <SubformTraces
        formSection={formSection}
        openDrawer={open}
        handleClose={handleClose}
        field={field}
        formik={formik}
        index={index}
        recordType={recordType}
        mode={mode}
      />
    );
  }

  return (
    <SubformDialog
      arrayHelpers={arrayHelpers}
      dialogIsNew={dialogIsNew}
      field={fieldToRender}
      formik={formik}
      i18n={i18n}
      index={index}
      isFormShow={mode.isShow || isDisabled || isReadWriteForm === false}
      mode={mode}
      oldValue={!dialogIsNew ? selectedValue : {}}
      open={open}
      setOpen={setOpen}
      title={title}
      formSection={formSection}
      isReadWriteForm={isReadWriteForm}
      orderedValues={orderedValues}
      recordType={recordType}
      recordModuleID={recordModuleID}
      asDrawer={isViolation}
    />
  );
};

Component.displayName = NAME;

Component.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  dialogIsNew: PropTypes.bool.isRequired,
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  forms: PropTypes.object.isRequired,
  formSection: PropTypes.object,
  index: PropTypes.number,
  isDisabled: PropTypes.bool,
  isReadWriteForm: PropTypes.bool,
  isTraces: PropTypes.bool,
  isViolation: PropTypes.bool,
  mode: PropTypes.object.isRequired,
  open: PropTypes.bool,
  orderedValues: PropTypes.array.isRequired,
  recordModuleID: PropTypes.string,
  recordType: PropTypes.string,
  selectedValue: PropTypes.object,
  setOpen: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default Component;
