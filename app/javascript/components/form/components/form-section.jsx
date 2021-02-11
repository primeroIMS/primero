/* eslint-disable react/no-multi-comp, react/display-name */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import get from "lodash/get";

import Tooltip from "../../tooltip";
import ActionButton from "../../action-button";

import { FORM_SECTION_NAME } from "./constants";
import FormSectionField from "./form-section-field";
import FormSectionTitle from "./form-section-title";
import styles from "./styles.css";
import FormSectionTabs from "./form-section-tabs";

const FormSection = ({ formSection, showTitle, disableUnderline }) => {
  const css = makeStyles(styles)();
  const { errors } = useFormContext();
  const { fields, check_errors: checkErrors, expandable, tooltip } = formSection;
  const [expanded, setExpanded] = useState(formSection.expanded);

  const fieldKey = (name, id) => {
    if (id) {
      return `${name}-${id}`;
    }

    return name;
  };

  const renderFields = fieldsToRender => {
    return fieldsToRender.map(field => {
      if (field?.row) {
        const key =
          field?.customRowStyle || field?.customHeaderStyle ? field?.row[0]?.name : `${formSection.unique_id}-row`;

        const classes = clsx({
          [css.notEqual]: field.equalColumns === false,
          [css.row]: !field?.customRowStyle,
          [css.rowCustom]: field?.customRowStyle,
          [css.headerCustom]: field?.customHeaderStyle
        });

        return (
          <div key={key} className={classes}>
            {renderFields(field.row)}
          </div>
        );
      }

      if (field?.tabs) {
        return <FormSectionTabs tabs={field.tabs} />;
      }

      return (
        <FormSectionField
          field={field}
          disableUnderline={disableUnderline}
          key={fieldKey(field.name, field.internalFormFieldID)}
          checkErrors={checkErrors}
        />
      );
    });
  };

  const renderError = () => checkErrors?.size && checkErrors.find(checkError => get(errors, checkError));

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const renderActions = formActions =>
    formActions?.length ? (
      <div className={css.formActions}>
        {formActions.map(action => (
          <ActionButton key={action.text} {...action} />
        ))}
      </div>
    ) : null;

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
        {renderActions(formSection.actions)}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );

  const renderFormSection = () => (
    <>
      {showTitle && <FormSectionTitle formSection={formSection} />}
      {renderFields(fields)}
      {renderActions(formSection.actions)}
    </>
  );

  return expandable ? renderExpandableFormSection() : renderFormSection();
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
