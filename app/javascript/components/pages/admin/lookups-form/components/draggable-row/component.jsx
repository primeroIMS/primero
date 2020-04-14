import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { fromJS } from "immutable";
import { Draggable } from "react-beautiful-dnd";

import styles from "../form/styles.css";
import { DragIndicator } from "../../../forms/forms-list/components";
import FormSectionField from "../../../../../form/components/form-section-field";

import { NAME } from "./constants";

const Component = ({
  defaultField,
  hiddenClassName,
  index,
  isDragDisabled,
  translatedField,
  uniqueId
}) => {
  const css = makeStyles(styles)();

  return (
    <Draggable
      key={uniqueId}
      draggableId={uniqueId}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provider, snap) => {
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
            <div>
              <FormSectionField
                field={defaultField}
                key={defaultField.name}
                checkErrors={fromJS({})}
              />
            </div>
            <div className={hiddenClassName}>
              <FormSectionField
                field={translatedField}
                key={translatedField.name}
                checkErrors={fromJS({})}
              />
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  defaultField: PropTypes.object,
  hiddenClassName: PropTypes.string,
  index: PropTypes.number,
  isDragDisabled: PropTypes.bool,
  translatedField: PropTypes.object,
  uniqueId: PropTypes.number
};

export default Component;
