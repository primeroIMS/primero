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

import { NAME } from "./constants";

const Component = ({ defaultOptionId, handleChange, index, name, option }) => {
  const css = makeStyles(styles)();
  const { errors } = useFormContext();
  const displayTextName = `${name}.option_strings_text.en[${index}].display_text`;
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
                inputProps={{ value: option.id }}
                checked={option.id === defaultOptionId}
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
  handleChange: PropTypes.func,
  index: PropTypes.number,
  name: PropTypes.string.isRequired,
  option: PropTypes.object
};

Component.displayName = NAME;

export default Component;
