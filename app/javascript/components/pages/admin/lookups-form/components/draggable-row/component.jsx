import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Draggable } from "react-beautiful-dnd";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

import styles from "../styles.css";
import { DragIndicator } from "../../../forms/forms-list/components";
import FormSectionField from "../../../../../form/components/form-section-field";
import { FieldRecord, TEXT_FIELD } from "../../../../../form";

import { NAME } from "./constants";

const Component = ({
  firstLocaleOption,
  index,
  isDragDisabled,
  localesKeys,
  onRemoveClick,
  selectedOption,
  uniqueId
}) => {
  const css = makeStyles(styles)();

  const renderTranslationValues = () => {
    return localesKeys.map(localeKey => {
      const name = `values.${localeKey}.${uniqueId}`;
      const show =
        firstLocaleOption === localeKey || selectedOption === localeKey;

      return (
        <div key={name} className={!show ? css.hideTranslationsFields : null}>
          <FormSectionField field={FieldRecord({ name, type: TEXT_FIELD })} />
        </div>
      );
    });
  };

  return (
    <Draggable
      key={uniqueId}
      draggableId={uniqueId}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {provider => {
        return (
          <div
            ref={provider.innerRef}
            {...provider.draggableProps}
            {...provider.dragHandleProps}
            className={css.row}
          >
            <div className={css.dragIndicatorContainer}>
              <DragIndicator {...provider.dragHandleProps} />
            </div>
            {renderTranslationValues()}
            <div className={css.dragIndicatorContainer}>
              <IconButton
                aria-label="delete"
                className={css.removeIcon}
                onClick={() => onRemoveClick(uniqueId)}
                disabled={isDragDisabled}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  firstLocaleOption: PropTypes.string,
  index: PropTypes.number,
  isDragDisabled: PropTypes.bool,
  localesKeys: PropTypes.array,
  onRemoveClick: PropTypes.func,
  selectedOption: PropTypes.string,
  uniqueId: PropTypes.string
};

export default Component;
