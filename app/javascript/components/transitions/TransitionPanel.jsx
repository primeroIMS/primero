import { useState } from "react";
import PropTypes from "prop-types";
import { Accordion } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { TRANSITION_PANEL_NAME as NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const TransitionPanel = ({ children }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpanded = () => {
    setExpanded(!expanded);
  };
  const css = useStyles();

  return (
    <Accordion expanded={expanded} onChange={handleExpanded} className={css.panel}>
      {children}
    </Accordion>
  );
};

TransitionPanel.displayName = NAME;

TransitionPanel.propTypes = {
  children: PropTypes.node.isRequired
};

export default TransitionPanel;
