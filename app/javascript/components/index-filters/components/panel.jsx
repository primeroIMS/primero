// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Accordion, AccordionSummary, AccordionDetails, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import isEmpty from "lodash/isEmpty";

import { RefreshIcon } from "../../../images/primero-icons";
import { useI18n } from "../../i18n";
import buildNameFilter from "../utils/build-name-filter";
import { useApp } from "../../application";
import { useThemeHelper } from "../../../libs";
import useSystemStrings, { FILTER } from "../../application/use-system-strings";

import css from "./styles.css";

function Panel({ filter, getValues, selectedDefaultValueField, handleReset, moreSectionFilters = {}, children }) {
  const { isRTL } = useThemeHelper();
  const { name, field_name: fieldName } = filter;

  const hasValue = !isEmpty(getValues()?.[selectedDefaultValueField || fieldName]);
  const i18n = useI18n();
  const { approvalsLabels } = useApp();
  const [open, setOpen] = useState(false);
  const { label } = useSystemStrings(FILTER);
  const handleChange = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setOpen(hasValue);
  }, [hasValue]);

  const expanded = open || Object.keys(moreSectionFilters).includes(selectedDefaultValueField || fieldName);

  const filterLabel = buildNameFilter(name, fieldName, label, approvalsLabels);

  return (
    <Accordion className={css.panel} elevation={0} expanded={expanded} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className={css.heading}>
          <div className={css.panelTitle}>{filterLabel}</div>
          {handleReset && (
            <IconButton
              aria-label={i18n.t("buttons.delete")}
              justifycontent="flex-end"
              size="small"
              onClick={handleReset}
            >
              <RefreshIcon className={isRTL ? css.flipImage : ""} />
            </IconButton>
          )}
        </div>
      </AccordionSummary>
      <AccordionDetails className={css.panelDetails}>{children}</AccordionDetails>
    </Accordion>
  );
}

Panel.displayName = "Panel";

Panel.propTypes = {
  children: PropTypes.node.isRequired,
  filter: PropTypes.object.isRequired,
  getValues: PropTypes.func.isRequired,
  handleReset: PropTypes.func,
  moreSectionFilters: PropTypes.object,
  selectedDefaultValueField: PropTypes.string
};

export default Panel;
