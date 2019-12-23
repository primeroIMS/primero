import React from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import { makeStyles } from "@material-ui/styles";

import { ActionDialog } from "../../action-dialog";

import Fields from "./fields";
import ActionButtons from "./action-buttons";
import styles from "./styles.css";
import { NAME } from "./constants";

const Component = ({
  activeStep,
  fields,
  formProps,
  handleBack,
  handleNext,
  handleSaveAndAction,
  modalProps,
  recordType,
  totalSteps
}) => {
  const css = makeStyles(styles)();

  const actioButtonsProps = {
    activeStep,
    totalSteps,
    handleNext,
    handleBack,
    handleSaveAndAction
  };

  const fieldsProps = {
    recordType,
    activeStep,
    fields
  };

  return (
    <ActionDialog {...modalProps}>
      <Formik {...formProps}>
        {({ handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className={css.content}>
                <Fields {...fieldsProps} />
              </div>
              <ActionButtons {...actioButtonsProps} />
            </Form>
          );
        }}
      </Formik>
    </ActionDialog>
  );
};

Component.propTypes = {
  activeStep: PropTypes.number,
  fields: PropTypes.array,
  formProps: PropTypes.object,
  handleBack: PropTypes.func,
  handleNext: PropTypes.func,
  handleSaveAndAction: PropTypes.func,
  modalProps: PropTypes.object,
  recordType: PropTypes.string,
  totalSteps: PropTypes.number
};

Component.displayName = NAME;

export default Component;
