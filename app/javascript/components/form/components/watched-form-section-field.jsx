import React from "react";
import PropTypes from "prop-types";
import { useFormContext, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";

import { ConditionalWrapper } from "../../../libs";
import useFormField from "../use-form-field";

const WatchedFormSectionField = ({ checkErrors, field }) => {
  const {
    Field,
    WrapWithComponent,
    commonInputProps,
    errorsToCheck,
    handleVisibility,
    isNotVisible,
    metaInputProps,
    methods,
    optionSelectorArgs,
    error
  } = useFormField(field, { checkErrors });
  const { control } = useFormContext();
  const { watchedInputs, handleWatchedInputs, name } = field;

  const watchedInputValues = useWatch({
    control,
    name: watchedInputs,
    defaultValue: []
  });

  const watchedInputProps = handleWatchedInputs
    ? handleWatchedInputs(watchedInputValues, name, { error, methods })
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
          />
        </ConditionalWrapper>
      )}
    </div>
  );
};

WatchedFormSectionField.displayName = "WatchedFormSectionField";

WatchedFormSectionField.propTypes = {
  checkErrors: PropTypes.object,
  field: PropTypes.object.isRequired
};

export default WatchedFormSectionField;
