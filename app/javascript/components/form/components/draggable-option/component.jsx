import PropTypes from "prop-types";
import clsx from "clsx";
import { Draggable } from "react-beautiful-dnd";
import { Controller, useWatch } from "react-hook-form";
import { makeStyles, Radio } from "@material-ui/core";
import get from "lodash/get";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

import TextInput from "../../fields/text-input";
import SwitchInput from "../../fields/switch-input";
import css from "../../fields/styles.css";
import DragIndicator from "../../../pages/admin/forms-list/components/drag-indicator";
import { generateIdFromDisplayText } from "../../utils/handle-options";

import { NAME } from "./constants";

const Component = ({
  defaultOptionId,
  index,
  name,
  option,
  onRemoveClick,
  formMethods,
  formMode,
  showDefaultAction,
  showDeleteAction,
  showDisableOption,
  isTallyField
}) => {
  const {
    errors,
    setValue,
    formState: { isDirty },
    control
  } = formMethods;
  const optionField = isTallyField ? "tally" : "option_strings_text";
  const displayTextFieldName = `${name}.${optionField}[${index}].display_text.en`;
  const idFieldName = `${name}.${optionField}[${index}].id`;
  const selectedValueFieldName = `${name}.selected_value`;

  const optionId = useWatch({ control, name: `${name}.${optionField}[${index}].id`, defaultValue: option.id });
  const disabledValue = useWatch({
    control,
    name: `${name}.${optionField}[${index}].disabled`,
    defaultValue: option?.disabled
  });
  const selectedValue = useWatch({ control, name: `${name}.selected_value`, defaultValue: defaultOptionId });

  const error = errors ? get(errors, displayTextFieldName) : undefined;

  const classes = makeStyles({
    disabled: {
      "&&&:before": {
        borderBottomStyle: "solid"
      },
      "&&:after": {
        borderBottomStyle: "solid"
      }
    }
  })();

  const handleChange = event => {
    const { value } = event.currentTarget;
    const newOptionId = generateIdFromDisplayText(value);

    if (isDirty && value && option.isNew) {
      setValue(idFieldName, newOptionId, { shouldDirty: true });

      if (selectedValue === optionId) {
        setValue(selectedValueFieldName, newOptionId, { shouldDirty: true });
      }
    }

    return value;
  };

  const renderCheckbox = formMode.get("isEdit") && showDisableOption && (
    <SwitchInput
      commonInputProps={{ name: `${name}.option_strings_text[${index}].disabled` }}
      metaInputProps={{ selectedValue: disabledValue }}
      formMethods={formMethods}
    />
  );

  const handleRemoveClick = () => onRemoveClick(index);

  const renderRemoveButton = formMode.get("isNew") && showDeleteAction && (
    <IconButton aria-label="delete" className={css.removeIcon} onClick={handleRemoveClick}>
      <DeleteIcon />
    </IconButton>
  );
  const classesDragIndicator = clsx([css.fieldColumn, css.dragIndicatorColumn]);
  const classesTextInput = clsx([css.fieldColumn, css.fieldInput]);
  const handleOnBlur = event => handleChange(event, index);

  return (
    <Draggable draggableId={option.fieldID} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div className={css.fieldRow}>
            <div className={classesDragIndicator}>
              <DragIndicator {...provided.dragHandleProps} />
            </div>
            <div className={classesTextInput}>
              <TextInput
                formMethods={formMethods}
                commonInputProps={{
                  name: displayTextFieldName,
                  className: css.inputOptionField,
                  error: typeof error !== "undefined",
                  helperText: error?.message,
                  // eslint-disable-next-line camelcase
                  defaultValue: option?.display_text?.en,
                  InputProps: {
                    classes,
                    onBlur: handleOnBlur
                  }
                }}
              />
              <input
                className={css.displayNone}
                type="text"
                name={idFieldName}
                ref={formMethods.register}
                defaultValue={option.id}
              />
            </div>
            {showDefaultAction && (
              <div className={css.fieldColumn}>
                <Controller
                  control={control}
                  as={<Radio />}
                  inputProps={{ value: optionId }}
                  checked={optionId === selectedValue}
                  name={`${name}.selected_value`}
                  defaultValue={false}
                />
              </div>
            )}
            {((formMode.get("isNew") && showDeleteAction) || showDisableOption) && (
              <div className={css.fieldColumn}>
                {renderCheckbox}
                {renderRemoveButton}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

Component.defaultProps = {
  disabled: false
};

Component.propTypes = {
  defaultOptionId: PropTypes.string,
  disabled: PropTypes.bool,
  formMethods: PropTypes.object.isRequired,
  formMode: PropTypes.object.isRequired,
  index: PropTypes.number,
  isTallyField: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onRemoveClick: PropTypes.func,
  option: PropTypes.object,
  showDefaultAction: PropTypes.bool,
  showDeleteAction: PropTypes.bool,
  showDisableOption: PropTypes.bool
};

Component.displayName = NAME;

export default Component;
