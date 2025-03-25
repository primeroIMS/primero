// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ApprovalSummary from "../summary";
import ApprovalDetail from "../detail";
import { NAME_PANEL } from "../../constants";

function Component({ approvalSubform, css, primeroModule }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpanded = () => {
    setExpanded(!expanded);
  };

  const isRequest = approvalSubform.get("approval_requested_for") != null;
  const isResponse = approvalSubform.get("approval_response_for") != null;

  const sharedProps = {
    approvalSubform,
    css,
    isRequest,
    isResponse,
    primeroModule
  };

  return (
    <div key={approvalSubform.get("unique_id")} data-testid="approval-panel">
      <Accordion expanded={expanded} onChange={handleExpanded} className={css.panel}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="filter-controls-content"
          id={approvalSubform.get("unique_id")}
          classes={{
            expandIcon: css.expandIcon
          }}
        >
          <ApprovalSummary {...sharedProps} />
        </AccordionSummary>
        <AccordionDetails>
          <ApprovalDetail {...sharedProps} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

Component.displayName = NAME_PANEL;

Component.propTypes = {
  approvalSubform: PropTypes.object.isRequired,
  css: PropTypes.object.isRequired,
  primeroModule: PropTypes.string
};
export default Component;
