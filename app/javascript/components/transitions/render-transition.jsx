import { AccordionSummary, AccordionDetails } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import renderDetails from "./render-details";
import renderSummary from "./render-summary";
import TransitionPanel from "./TransitionPanel";

// eslint-disable-next-line react/display-name
export default (transition, css, recordType, showMode) => {
  const { id } = transition;
  const { expandIcon } = css;

  return (
    <div key={id}>
      <TransitionPanel key={id} name={id}>
        <AccordionSummary
          classes={{ expandIcon }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="filter-controls-content"
          id={id}
        >
          {renderSummary(transition, css, recordType, showMode)}
        </AccordionSummary>
        <AccordionDetails>{renderDetails(transition, css)}</AccordionDetails>
      </TransitionPanel>
    </div>
  );
};
