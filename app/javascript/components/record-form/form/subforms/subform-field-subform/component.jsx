// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { SUBFORM_FIELD_SUBFORM } from "../constants";
import css from "../styles.css";
import SubformField from "../component";
import { useI18n } from "../../../../i18n";

import { EXPANDED } from "./constants";

const Component = ({ isViolation, parentTitle, parentValues, fieldProps, violationOptions }) => {
  const i18n = useI18n();

  const { field: subformSectionField } = fieldProps;

  const isExpanded = subformSectionField.collapse === EXPANDED;
  const [expanded, setExpanded] = useState(isExpanded);
  const handleExpanded = () => {
    setExpanded(!expanded);
  };
  const renderSubform = (
    <div className={css.subFormField}>
      <SubformField
        {...{
          ...fieldProps,
          formSection: subformSectionField.subform_section_id,
          forms: {},
          parentTitle,
          parentValues,
          violationOptions,
          renderAsAccordion: Boolean(subformSectionField.collapse) && isViolation && parentTitle
        }}
      />
    </div>
  );

  if (!subformSectionField.collapse) {
    return <div className={css.subFormField}>{renderSubform}</div>;
  }

  return (
    <div className={css.subFormField}>
      <Accordion expanded={expanded} onChange={handleExpanded} className={css.panelAccordion}>
        <AccordionSummary
          classes={{
            expanded: css.accordionSummaryExpanded,
            content: css.accordionSummaryContent
          }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="filter-controls-content"
        >
          <h4 className={css.accordionSummaryContentTitle}>{subformSectionField.display_name?.[i18n.locale]}</h4>
        </AccordionSummary>
        <AccordionDetails className={css.accordionDetails}>{renderSubform}</AccordionDetails>
      </Accordion>
    </div>
  );
};

Component.displayName = SUBFORM_FIELD_SUBFORM;

Component.propTypes = {
  fieldProps: PropTypes.object,
  isViolation: PropTypes.bool,
  parentTitle: PropTypes.string,
  parentValues: PropTypes.object,
  violationOptions: PropTypes.array
};

export default Component;
