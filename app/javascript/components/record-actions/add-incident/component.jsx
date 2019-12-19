/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Formik, Form } from "formik";

import { useI18n } from "../../i18n";
import { ActionDialog } from "../../action-dialog";
import { FieldRecord } from "../../record-form";

import Fields from "./fields";
import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({
  openIncidentDialog,
  close,
  recordType,
  records,
  selectedRowsIndex
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!openIncidentDialog) {
      setActiveStep(0);
    }
  }, [openIncidentDialog]);

  const fields = [
    {
      display_name:
        "Do you have consent from the individual to make this transfer?",
      name: "consent",
      type: "tick_box",
      step: 0
    },
    {
      display_name: "Location of contact",
      name: "location",
      type: "select_box",
      step: 3
    },
    {
      display_name: "How did you come into contact with this migrant?",
      name: "contact_migrant",
      type: "select_box",
      step: 1
    },
    {
      display_name: "Date of contact",
      name: "date_of_contact",
      type: "date_field",
      step: 2
    },
    {
      display_name: "Details of contact",
      name: "details_of_contact",
      type: "text_field",
      step: 0
    },
    {
      display_name: "Has child attempted migration before?",
      name: "attempted_migration",
      type: "radio_button",
      step: 4
    }
  ];

  const renderStepsContent = index => {
    const stepsFields = fields.filter(f => f.step === index);
    const formattedFields = stepsFields.map(stepsField => {
      const field = { ...stepsField };

      delete field.step;

      return FieldRecord(field);
    });

    return <Fields fields={formattedFields} />;
  };

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const previousButtonClass =
    activeStep === 0 || activeStep === 4 ? css.hide : null;

  const nextButton =
    activeStep === 4 ? (
      <>
        <Button variant="contained" color="primary" onClick={handleNext}>
          {i18n.t("buttons.save")}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleNext}
          className={css.successButton}
        >
          {i18n.t("buttons.save_and_add_service_provision")}
        </Button>
      </>
    ) : (
      <Button variant="contained" color="primary" onClick={handleNext}>
        {i18n.t("actions.next")}
      </Button>
    );

  const justifyButtons = activeStep === 4 ? "flex-start" : "space-between";

  const formProps = {
    initialValues: {},
    onSubmit: () => {}
  };

  return (
    <ActionDialog
      open={openIncidentDialog}
      successHandler={() => {}}
      dialogTitle={i18n.t("actions.incident_details_from_case")}
      dialogTitleSmall={`Step ${activeStep + 1} of 5`}
      confirmButtonLabel={i18n.t("buttons.save")}
      onClose={close}
      hideModalActions
    >
      <Formik {...formProps}>
        {({ handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className={css.content}>
                {renderStepsContent(activeStep)}
              </div>
              <Grid
                container
                direction="row"
                justify={justifyButtons}
                alignItems="flex-end"
                className={css.actionButtons}
              >
                <Button
                  className={previousButtonClass}
                  onClick={handleBack}
                  variant="outlined"
                  color="primary"
                >
                  {i18n.t("actions.previous")}
                </Button>
                {nextButton}
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </ActionDialog>
  );
};

Component.propTypes = {
  close: PropTypes.func,
  openIncidentDialog: PropTypes.bool,
  records: PropTypes.array,
  recordType: PropTypes.string,
  selectedRowsIndex: PropTypes.array
};

Component.displayName = NAME;

export default Component;
