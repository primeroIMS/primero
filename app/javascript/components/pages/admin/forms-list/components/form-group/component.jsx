import PropTypes from "prop-types";
import { Accordion, AccordionSummary, AccordionDetails, makeStyles } from "@material-ui/core";
import { Draggable } from "react-beautiful-dnd";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import styles from "../../styles.css";
import DragIndicator from "../drag-indicator";
import { FORM_GROUP_PREFIX } from "../../constants";

const useStyles = makeStyles(styles);

const Component = ({ name, id, index, children, isDragDisabled }) => {
  const css = useStyles();

  return (
    <Draggable draggableId={`${FORM_GROUP_PREFIX}-${id}`} index={index} isDragDisabled={isDragDisabled}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <Accordion elevation={3} className={css.summaryPanel}>
            <AccordionSummary
              classes={{ root: css.summary, content: css.summaryContent }}
              expandIcon={<ExpandMoreIcon />}
            >
              <DragIndicator {...provided.dragHandleProps} isDragDisabled={isDragDisabled} />
              {name}
            </AccordionSummary>
            <AccordionDetails classes={{ root: css.details }}>{children}</AccordionDetails>
          </Accordion>
        </div>
      )}
    </Draggable>
  );
};

Component.displayName = "FormGroup";

Component.defaultProps = {
  isDragDisabled: false
};

Component.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  isDragDisabled: PropTypes.bool,
  name: PropTypes.string.isRequired
};

export default Component;
