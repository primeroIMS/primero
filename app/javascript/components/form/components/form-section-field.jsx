import React, { memo } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { ConditionalWrapper } from "../../../libs";
import useFormField from "../use-form-field";

const FormSectionField = ({ checkErrors, field }) => {
  const {
    Field,
    WrapWithComponent,
    commonInputProps,
    errorsToCheck,
    handleVisibility,
    isNotVisible,
    metaInputProps,
    optionSelectorArgs
  } = useFormField(field, { checkErrors });

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
          />
        </ConditionalWrapper>
      )}
    </div>
  );
};

FormSectionField.displayName = "FormSectionField";

FormSectionField.propTypes = {
  checkErrors: PropTypes.object,
  field: PropTypes.object.isRequired
};

export default memo(FormSectionField);
