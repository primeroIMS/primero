// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Grid, Divider } from "@mui/material";
import { Form, Field } from "formik";
import { TextField as MuiTextField } from "formik-mui";

import { useI18n } from "../../../i18n";
import DisplayData from "../../../display-data";

import { REQUEST_FORM_NAME, NOTES_FIELD } from "./constants";

const sharedTextFieldProps = {
  autoFocus: true,
  margin: "normal",
  fullWidth: true
};

const RequestForm = ({ formProps, record }) => {
  const i18n = useI18n();
  const { handleSubmit } = formProps;

  return (
    <>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DisplayData label="cases.case_worker_code" value={record && record.get("owned_by")} />
          </Grid>
          <Grid item xs={6}>
            <DisplayData label="cases.agency" />
          </Grid>
        </Grid>
        <Divider />
        <Field
          name={NOTES_FIELD}
          label={i18n.t("request_transfer.notes_label")}
          component={MuiTextField}
          InputLabelProps={{
            shrink: true
          }}
          required
          {...sharedTextFieldProps}
        />
      </Form>
    </>
  );
};

RequestForm.displayName = REQUEST_FORM_NAME;

RequestForm.propTypes = {
  formProps: PropTypes.object,
  record: PropTypes.object
};

export default RequestForm;
