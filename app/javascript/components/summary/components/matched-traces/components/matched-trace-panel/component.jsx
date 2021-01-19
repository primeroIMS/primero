import React from "react";
import PropTypes from "prop-types";
import { ExpansionPanel, ExpansionPanelSummary } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import ActionButton from "../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../action-button/constants";

import { NAME } from "./constants";

const Component = ({ css, matchedTrace }) => {
  const matchedTraceId = matchedTrace.get("id");
  const handleOnClick = id => console.log("ID", id);

  return (
    <ExpansionPanel expanded={false} onChange={() => handleOnClick(matchedTraceId)}>
      <ExpansionPanelSummary expandIcon={<ChevronRightIcon />} aria-controls="filter-controls-content" id={1}>
        <ActionButton
          text={matchedTraceId}
          type={ACTION_BUTTON_TYPES.default}
          isTransparent
          rest={{
            onClick: () => handleOnClick(matchedTraceId),
            className: css.link
          }}
        />
      </ExpansionPanelSummary>
    </ExpansionPanel>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  css: PropTypes.object,
  matchedTrace: PropTypes.object
};

export default Component;
