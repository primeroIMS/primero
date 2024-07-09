// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import DraggableOption from "../draggable-option";

function Component({
  defaultOptionId,
  fieldName,
  fields,
  formMethods,
  formMode,
  onRemoveValue,
  optionFieldName,
  showDefaultAction,
  showDeleteAction,
  showDisableOption
}) {
  return fields.map((option, index) => (
    <DraggableOption
      defaultOptionId={defaultOptionId}
      optionFieldName={optionFieldName || "option_strings_text"}
      name={fieldName}
      option={option}
      index={index}
      key={option.fieldID}
      onRemoveClick={onRemoveValue}
      formMethods={formMethods}
      formMode={formMode}
      showDefaultAction={showDefaultAction}
      showDeleteAction={showDeleteAction}
      showDisableOption={showDisableOption}
    />
  ));
}

Component.displayName = "OrderableOptionList";

Component.PropTypes = {
  defaultOptionId: PropTypes.string,
  fieldName: PropTypes.string,
  fields: PropTypes.array,
  formMethods: PropTypes.object,
  formMode: PropTypes.object,
  onRemoveValue: PropTypes.func,
  optionFieldName: PropTypes.string,
  showDefaultAction: PropTypes.bool,
  showDeleteAction: PropTypes.bool,
  showDisableOption: PropTypes.bool
};

export default Component;
