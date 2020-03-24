import React from "react";
import PropTypes from "prop-types";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  makeStyles
} from "@material-ui/core";
import { Draggable } from "react-beautiful-dnd";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import styles from "../styles.css";

import DragIndicator from "./drag-indicator";

const FormGroup = ({ name, id, index, children }) => {
  const css = makeStyles(styles)();

  return (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <ExpansionPanel elevation={3} className={css.summaryPanel}>
            <ExpansionPanelSummary
              classes={{ root: css.summary, content: css.summaryContent }}
              expandIcon={<ExpandMoreIcon />}
            >
              <DragIndicator {...provided.dragHandleProps} />
              {name}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails classes={{ root: css.details }}>
              {children}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      )}
    </Draggable>
  );
};

FormGroup.displayName = "FormGroup";

FormGroup.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
};

export default FormGroup;
