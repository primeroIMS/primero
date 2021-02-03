/* eslint-disable react/no-multi-comp, react/display-name */
import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import get from "lodash/get";
import { useFormContext } from "react-hook-form";

import Tooltip from "../../tooltip";

import { FORM_SECTION_NAME } from "./constants";
import FormSectionTitle from "./form-section-title";
import styles from "./styles.css";
import Fields from "./fields";
import FormSectionActions from "./form-section-actions";

const FormSection = ({ formSection, showTitle, disableUnderline }) => {
  const css = makeStyles(styles)();
  const { fields, check_errors: checkErrors, expandable, tooltip } = formSection;
  const { errors } = useFormContext();
  const [expanded, setExpanded] = useState(formSection.expanded);

  const renderError = () => checkErrors?.size && checkErrors.find(checkError => get(errors, checkError));

  const handleChange = () => {
    setExpanded(!expanded);
  };

  if (expandable) {
    return (
      <Accordion elevation={3} expanded={expanded} onChange={handleChange}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Tooltip title={tooltip}>
            <Typography
              className={clsx({
                [css.heading]: true,
                [css.error]: renderError()
              })}
            >
              <FormSectionTitle formSection={formSection} />
            </Typography>
          </Tooltip>
        </AccordionSummary>
        <AccordionDetails classes={{ root: css.panelContent }}>
          <Fields fields={fields} checkErrors={checkErrors} disableUnderline={disableUnderline} css={css} />
          <FormSectionActions actions={formSection.actions} css={css} />
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <>
      {showTitle && <FormSectionTitle formSection={formSection} />}
      <Fields fields={fields} checkErrors={checkErrors} disableUnderline={disableUnderline} css={css} />
      <FormSectionActions actions={formSection.actions} css={css} />
    </>
  );
};

FormSection.displayName = FORM_SECTION_NAME;

FormSection.defaultProps = {
  disableUnderline: false,
  showTitle: true
};

FormSection.propTypes = {
  disableUnderline: PropTypes.bool,
  formSection: PropTypes.object,
  showTitle: PropTypes.bool
};

export default FormSection;
