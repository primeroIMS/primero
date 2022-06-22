import PropTypes from "prop-types";

import buildFormGroupData from "../utils";

import NavGroup from "./nav-group";

const FormGroup = ({
  formGroup,
  formGroupLookup,
  formikValuesForNav,
  handleClick,
  isNew,
  open,
  recordAlerts,
  selectedForm,
  validationErrors
}) => {
  const group = buildFormGroupData(formGroup, formikValuesForNav);

  if (!group.size) {
    return null;
  }

  return (
    <NavGroup
      group={group}
      handleClick={handleClick}
      isNew={isNew}
      open={open}
      recordAlerts={recordAlerts}
      selectedForm={selectedForm}
      validationErrors={validationErrors}
      formGroupLookup={formGroupLookup}
    />
  );
};

FormGroup.displayName = "FormGroup";

FormGroup.propTypes = {
  formGroup: PropTypes.object,
  formGroupLookup: PropTypes.array,
  formikValuesForNav: PropTypes.object,
  handleClick: PropTypes.func,
  isNew: PropTypes.bool,
  open: PropTypes.bool,
  recordAlerts: PropTypes.array,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  validationErrors: PropTypes.array
};

export default FormGroup;
