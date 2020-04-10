import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import { Draggable } from "react-beautiful-dnd";
import findKey from "lodash/findKey";

import { MODULES } from "../../../../../../../config/constants";
import styles from "../../styles.css";
import DragIndicator from "../drag-indicator";

const Component = ({ name, modules, parentForm, uniqueID, index }) => {
  const css = makeStyles(styles)();

  const formSectionModules = modules
    .map(module => findKey(MODULES, value => module === value))
    ?.join(", ");

  return (
    <Draggable draggableId={uniqueID} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={css.row}
        >
          <div>
            <DragIndicator {...provided.dragHandleProps} />
          </div>
          <div>{name}</div>
          <div>{parentForm}</div>
          <div>{formSectionModules}</div>
        </div>
      )}
    </Draggable>
  );
};

Component.displayName = "TableRow";

Component.propTypes = {
  index: PropTypes.number.isRequired,
  modules: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  parentForm: PropTypes.string.isRequired,
  uniqueID: PropTypes.string.isRequired
};

export default Component;
