import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Draggable } from "react-beautiful-dnd";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox, makeStyles, Radio } from "@material-ui/core";
import get from "lodash/get";

import TextInput from "../../fields/text-input";
import styles from "../../fields/styles.css";
import DragIndicator from "../../../pages/admin/forms-list/components/drag-indicator";
import { generateIdFromDisplayText } from "../../utils/handle-options";

import { NAME } from "./constants";

const Component = ({ defaultOptionId, index, name, option }) => {
  const css = makeStyles(styles)();
  const { errors, setValue, watch } = useFormContext();
  const displayTextName = `${name}.option_strings_text.en[${index}].display_text`;
  const optionId = watch(
    `${name}.option_strings_text.en[${index}].id`,
    option.id
  );
  const selectedValue = watch(`${name}.selected_value`, defaultOptionId);
  const error = errors ? get(errors, displayTextName) : undefined;
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

    if (value && option.isNew) {
      setValue(`${name}.option_strings_text.en[${index}].id`, newOptionId);
    }

    return value;
  };

  return (
    <Draggable draggableId={option.id} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div className={css.fieldRow} key={option.id}>
            <div className={clsx([css.fieldColumn, css.dragIndicatorColumn])}>
              <DragIndicator {...provided.dragHandleProps} />
            </div>
            <div className={clsx([css.fieldColumn, css.fieldInput])}>
              <TextInput
                commonInputProps={{
                  name: displayTextName,
                  className: css.inputOptionField,
                  error: typeof error !== "undefined",
                  helperText: error?.message,
                  InputProps: {
                    classes,
                    onBlur: event => handleChange(event, index)
                  }
                }}
              />
            </div>
            <div className={css.fieldColumn}>
              <Controller
                as={<Radio />}
                inputProps={{ value: optionId }}
                checked={optionId === selectedValue}
                name={`${name}.selected_value`}
              />
            </div>
            <div className={css.fieldColumn}>
              <Checkbox disabled checked />
            </div>
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
  index: PropTypes.number,
  name: PropTypes.string.isRequired,
  option: PropTypes.object
};

Component.displayName = NAME;

export default Component;
