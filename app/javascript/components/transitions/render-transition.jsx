import { AccordionSummary, AccordionDetails } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import renderDetails from "./render-details";
import renderSummary from "./render-summary";
import TransitionPanel from "./TransitionPanel";

// eslint-disable-next-line react/display-name
export default (transition, css, recordType, showMode) => (
  <div key={transition.id}>
    <TransitionPanel key={transition.id} name={transition.id}>
      <AccordionSummary
        classes={{
          expandIcon: css.expandIcon
        }}
        expandIcon={<ExpandMoreIcon />}
        aria-controls="filter-controls-content"
        id={transition.id}
      >
        {renderSummary(transition, css, recordType, showMode)}
      </AccordionSummary>
      <AccordionDetails>{renderDetails(transition, css)}</AccordionDetails>
    </TransitionPanel>
  </div>
);
