import {
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core";
import ArrowIcon from "@material-ui/icons/KeyboardArrowRight";
import React from "react";

import renderDetails from "./render-details";
import renderSummary from "./render-summary";
import TransitionPanel from "./TransitionPanel";

export default (transition, css, recordType, showMode) => (
  <div key={transition.id}>
    <TransitionPanel key={transition.id} name={transition.id}>
      <ExpansionPanelSummary
        expandIcon={<ArrowIcon />}
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
