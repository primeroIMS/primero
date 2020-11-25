import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Draggable } from "react-beautiful-dnd";

import styles from "../styles.css";
import { DragIndicator } from "../../../forms-list/components";
import FormSectionField from "../../../../../form/components/form-section-field";
import { FieldRecord, TEXT_FIELD } from "../../../../../form";
import SwitchInput from "../../../../../form/fields/switch-input";

import { NAME } from "./constants";

const Component = ({ firstLocaleOption, index, isDragDisabled, localesKeys, selectedOption, uniqueId }) => {
  const css = makeStyles(styles)();

  const renderTranslationValues = () => {
    return localesKeys.map(localeKey => {
      const name = `values.${localeKey}.${uniqueId}`;
      const show = firstLocaleOption === localeKey || selectedOption === localeKey;

      return (
        <div key={name} className={!show ? css.hideTranslationsFields : null}>
          <FormSectionField field={FieldRecord({ name, type: TEXT_FIELD })} />
        </div>
      );
    });
  };

  const renderDisabledCheckbox = (
    <div className={css.dragIndicatorContainer}>
      <SwitchInput commonInputProps={{ name: `disabled.${uniqueId}`, disabled: isDragDisabled }} />
    </div>
  );

  return (
    <Draggable key={uniqueId} draggableId={uniqueId} index={index} isDragDisabled={isDragDisabled}>
      {provider => {
        return (
          <div ref={provider.innerRef} {...provider.draggableProps} {...provider.dragHandleProps} className={css.row}>
            <div className={css.dragIndicatorContainer}>
              <DragIndicator {...provider.dragHandleProps} />
            </div>
            {renderTranslationValues()}
            {renderDisabledCheckbox}
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
  selectedOption: PropTypes.string,
  uniqueId: PropTypes.string
};

export default Component;
