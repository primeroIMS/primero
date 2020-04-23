/* eslint-disable react/no-multi-comp */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/styles";
import get from "lodash/get";

import FormSectionField from "./form-section-field";
import FormSectionTitle from "./form-section-title";
import styles from "./styles.css";

const FormSection = ({ formSection }) => {
  const css = makeStyles(styles)();
  const { errors } = useFormContext();
  const { fields, check_errors: checkErrors, expandable } = formSection;
  const [expanded, setExpanded] = useState(formSection.expanded);

  const renderError = () =>
    checkErrors?.size &&
    checkErrors.find(checkError => get(errors, checkError));

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const fieldsToRender = fields.map(field => (
    <FormSectionField
      field={field}
      key={field.name}
      checkErrors={checkErrors}
    />
  ));

  // eslint-disable-next-line react/display-name
  const renderExpandableFormSection = () => (
    <ExpansionPanel elevation={3} expanded={expanded} onChange={handleChange}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          className={clsx({ [css.heading]: true, [css.error]: renderError() })}
        >
          <FormSectionTitle formSection={formSection} />
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails classes={{ root: css.panelContent }}>
        {fieldsToRender}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );

  // eslint-disable-next-line react/display-name
  const renderFormSection = () => (
    <>
      <FormSectionTitle formSection={formSection} />
      {fieldsToRender}
    </>
  );

  return expandable ? renderExpandableFormSection() : renderFormSection();
};

FormSection.displayName = "FormSection";

FormSection.propTypes = {
  formSection: PropTypes.object
};

export default FormSection;
