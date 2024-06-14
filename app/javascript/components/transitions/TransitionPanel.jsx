// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { Accordion } from "@mui/material";

import { TRANSITION_PANEL_NAME as NAME } from "./constants";
import css from "./styles.css";

function TransitionPanel({ children }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion data-testId="accordion" expanded={expanded} onChange={handleExpanded} className={css.panel}>
      {children}
    </Accordion>
  );
}

TransitionPanel.displayName = NAME;

TransitionPanel.propTypes = {
  children: PropTypes.node.isRequired
};

export default TransitionPanel;
