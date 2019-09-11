import React from "react";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";
import PropTypes from "prop-types";
import { Box, Button, InputAdornment } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { useI18n } from "components/i18n";
import { useDispatch } from "react-redux";
import { addFlag } from "../action-creators";

const initialFormikValues = {
  date: null,
  message: ""
};

const FlagForm = ({ recordType, record, handleOpen, handleActiveTab }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const path = Array.isArray(record)
    ? `${recordType}/flags`
    : `${recordType}/${record}/flags`;

  const inputProps = {
    component: TextField,
    fullWidth: true,
    InputLabelProps: {
      shrink: true
    }
  };

  const dateInputProps = {
    fullWidth: true,
    InputLabelProps: {
      shrink: true
    },
    format: "dd-MMM-yyyy",
    clearable: true,
    InputProps: {
      endAdornment: (
        <InputAdornment position="end">
          <CalendarTodayIcon />
        </InputAdornment>
      )
    }
  };

  const onSubmit = async (data, actions) => {
    const body = Array.isArray(record)
      ? { data: { data, record, record_type: recordType } }
      : { data };

    await dispatch(addFlag(body, i18n.t("flags.flag_added"), path));
    actions.resetForm(initialFormikValues);
    handleActiveTab(0);
  };

  const formProps = {
    initialValues: initialFormikValues,
    onSubmit
  };

  return (
    <Box mx={4} mt={4}>
      <Formik {...formProps}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Box my={2}>
              <Field
                name="message"
                label={i18n.t("flags.flag_reason")}
                {...inputProps}
                multiline
                autoFocus
              />
            </Box>
            <Box my={2}>
              <Field
                name="date"
                render={({ field, form, ...other }) => {
                  return (
                    <DatePicker
                      {...field}
                      label={i18n.t("flags.flag_date")}
                      onChange={date => {
                        return (
                          date && form.setFieldValue(field.name, date, true)
                        );
                      }}
                      {...dateInputProps}
                      {...other}
                    />
                  );
                }}
              />
            </Box>
            <Box display="flex" my={3} justifyContent="flex-end">
              <Button onClick={handleOpen}>{i18n.t("buttons.cancel")}</Button>
              <Button type="submit">{i18n.t("buttons.save")}</Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

FlagForm.propTypes = {
  recordType: PropTypes.string.isRequired,
  record: PropTypes.string.isRequired,
  handleOpen: PropTypes.func.isRequired,
  handleActiveTab: PropTypes.func
};

export default FlagForm;
