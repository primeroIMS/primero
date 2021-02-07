import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { ConditionalWrapper } from "../../../libs";
import useFormField from "../use-form-field";
import formComponent from "../utils/form-component";

const FormSectionField = ({ checkErrors, field, formMethods, formMode }) => {
  const { errors } = formMethods;
  const {
    Field,
    WrapWithComponent,
    commonInputProps,
    errorsToCheck,
    handleVisibility,
    isNotVisible,
    metaInputProps,
    optionSelectorArgs
  } = useFormField(field, { checkErrors, errors, formMode });

  const { selector, compare } = optionSelectorArgs;
  const optionSource = useSelector(state => selector(state), compare);

  if (isNotVisible()) {
    return null;
  }

  return (
    <div>
      {handleVisibility() || (
        <ConditionalWrapper condition={Boolean(WrapWithComponent)} wrapper={WrapWithComponent}>
          <Field
            field={field}
            commonInputProps={commonInputProps}
            metaInputProps={metaInputProps}
            options={optionSource?.toJS()}
            errorsToCheck={errorsToCheck}
            formMethods={formMethods}
            formMode={formMode}
          />
        </ConditionalWrapper>
      )}
    </div>
  );
};

FormSectionField.displayName = "FormSectionField";

FormSectionField.propTypes = {
  checkErrors: PropTypes.object,
  field: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired,
  formMode: PropTypes.object.isRequired
};

export default formComponent(FormSectionField);
