import {
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";

import renderDetails from "./render-details";
import renderSummary from "./render-summary";
import TransitionPanel from "./TransitionPanel";

// eslint-disable-next-line react/display-name
export default (transition, css, recordType, showMode) => (
  <div key={transition.id}>
    <TransitionPanel key={transition.id} name={transition.id}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="filter-controls-content"
        id={transition.id}
      >
        {renderSummary(transition, css, recordType, showMode)}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {renderDetails(transition, css)}
      </ExpansionPanelDetails>
    </TransitionPanel>
  </div>
);
