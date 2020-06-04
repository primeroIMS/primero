import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core";
import ArrowIcon from "@material-ui/icons/KeyboardArrowRight";

import ApprovalSummary from "../summary";
import ApprovalDetail from "../detail";
import { NAME_PANEL } from "../../constants";

const Component = ({ approvalSubform, css }) => {
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
    isResponse
  };

  return (
    <div key={approvalSubform.get("unique_id")}>
      <ExpansionPanel
        expanded={expanded}
        onChange={handleExpanded}
        className={css.panel}
      >
        <ExpansionPanelSummary
          expandIcon={<ArrowIcon />}
          aria-controls="filter-controls-content"
          id={approvalSubform.get("unique_id")}
        >
          <ApprovalSummary {...sharedProps} />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ApprovalDetail {...sharedProps} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

Component.displayName = NAME_PANEL;

Component.propTypes = {
  approvalSubform: PropTypes.object.isRequired,
  css: PropTypes.object.isRequired
};
export default Component;
