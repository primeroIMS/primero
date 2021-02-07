import React from "react";
import PropTypes from "prop-types";
import { useWatch } from "react-hook-form";
import { useSelector } from "react-redux";

import { ConditionalWrapper } from "../../../libs";
import useFormField from "../use-form-field";
import formComponent from "../utils/form-component";

const WatchedFormSectionField = ({ checkErrors, field, formMethods, formMode }) => {
  const { control, errors } = formMethods;

  const {
    Field,
    WrapWithComponent,
    commonInputProps,
    errorsToCheck,
    handleVisibility,
    isNotVisible,
    metaInputProps,
    optionSelectorArgs,
    error
  } = useFormField(field, { checkErrors, errors, formMode });

  const { watchedInputs, handleWatchedInputs, name } = field;
  const watchedInputValues = useWatch({
    control,
    name: watchedInputs,
    defaultValue: []
  });
  const watchedInputProps = handleWatchedInputs
    ? handleWatchedInputs(watchedInputValues, name, { error, methods: formMethods })
    : {};

  const { selector, compare } = optionSelectorArgs;
  const optionSource = useSelector(state => selector(state, watchedInputValues), compare);

  const commonProps = {
    ...commonInputProps,
    ...watchedInputProps
  };

  const metaProps = {
    ...metaInputProps,
    groupBy: watchedInputProps?.groupBy || metaInputProps?.groupBy,
    watchedInputValues
  };

  if (isNotVisible(watchedInputProps)) {
    return null;
  }

  return (
    <div>
      {handleVisibility(watchedInputValues) || (
        <ConditionalWrapper condition={Boolean(WrapWithComponent)} wrapper={WrapWithComponent}>
          <Field
            field={field}
            commonInputProps={commonProps}
            metaInputProps={metaProps}
            options={watchedInputProps?.options || optionSource?.toJS()}
            errorsToCheck={errorsToCheck}
            formMethods={formMethods}
            formMode={formMode}
          />
        </ConditionalWrapper>
      )}
    </div>
  );
};

WatchedFormSectionField.displayName = "WatchedFormSectionField";

WatchedFormSectionField.propTypes = {
  checkErrors: PropTypes.object,
  field: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired,
  formMode: PropTypes.object.isRequired
};

export default formComponent(WatchedFormSectionField);
