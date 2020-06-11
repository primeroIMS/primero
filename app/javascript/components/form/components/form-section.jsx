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

import Tooltip from "../../tooltip";

import { FORM_SECTION_NAME } from "./constants";
import FormSectionField from "./form-section-field";
import FormSectionTitle from "./form-section-title";
import styles from "./styles.css";

const FormSection = ({ formSection }) => {
  const css = makeStyles(styles)();
  const { errors } = useFormContext();
  const {
    fields,
    check_errors: checkErrors,
    expandable,
    tooltip
  } = formSection;
  const [expanded, setExpanded] = useState(formSection.expanded);

  const renderFields = fieldsToRender => {
    return fieldsToRender.map(field => {
      if (field?.row) {
        return (
          <div
            key={`${formSection.unique_id}-row`}
            className={clsx({
              [css.notEqual]: field.equalColumns === false,
              [css.row]: true
            })}
          >
            {renderFields(field.row)}
          </div>
        );
      }

      return (
        <FormSectionField
          field={field}
          key={field.name}
          checkErrors={checkErrors}
        />
      );
    });
  };

  const renderError = () =>
    checkErrors?.size &&
    checkErrors.find(checkError => get(errors, checkError));

  const handleChange = () => {
    setExpanded(!expanded);
  };

  // eslint-disable-next-line react/display-name
  const renderExpandableFormSection = () => (
    <ExpansionPanel elevation={3} expanded={expanded} onChange={handleChange}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
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
      </ExpansionPanelSummary>
      <ExpansionPanelDetails classes={{ root: css.panelContent }}>
        {renderFields(fields)}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );

  // eslint-disable-next-line react/display-name
  const renderFormSection = () => (
    <>
      <FormSectionTitle formSection={formSection} />
      {renderFields(fields)}
    </>
  );

  return expandable ? renderExpandableFormSection() : renderFormSection();
};

FormSection.displayName = FORM_SECTION_NAME;

FormSection.propTypes = {
  formSection: PropTypes.object
};

export default FormSection;
