// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Accordion, AccordionSummary } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import ActionButton from "../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../action-button/constants";
import { getShortIdFromUniqueId } from "../../../../../records";

import { NAME } from "./constants";

const Component = ({ matchedTrace, setOpen, setSelectedTraceId }) => {
  const matchedTraceId = matchedTrace.get("id");
  const handleOnClick = id => {
    setOpen(true);
    setSelectedTraceId(id);
  };
  const handleClickAccordion = () => handleOnClick(matchedTraceId);

  return (
    <Accordion expanded={false} onChange={handleClickAccordion} data-testid="matched-trace-panel">
      <AccordionSummary
        expandIcon={<ChevronRightIcon />}
        aria-controls="filter-controls-content"
        id={1}
        data-testid="matched-trace-panel-summary"
      >
        <ActionButton
          id={`matched-trace-${matchedTraceId}`}
          text={getShortIdFromUniqueId(matchedTraceId)}
          type={ACTION_BUTTON_TYPES.default}
          variant="text"
          color="primary"
          noTranslate
          rest={{ onClick: handleClickAccordion }}
        />
      </AccordionSummary>
    </Accordion>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  matchedTrace: PropTypes.object,
  setOpen: PropTypes.func,
  setSelectedTraceId: PropTypes.func
};

export default Component;
