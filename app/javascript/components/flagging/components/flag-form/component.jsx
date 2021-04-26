import { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import { Box, InputAdornment } from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { object, string } from "yup";
import { parseISO } from "date-fns";

import { useI18n } from "../../../i18n";
import { addFlag } from "../../action-creators";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { DATE_FORMAT } from "../../../../config";
import { toServerDateFormat } from "../../../../libs";
import localize from "../../../../libs/date-picker-localization";

import { NAME, MAX_LENGTH_FLAG_REASON } from "./constants";

const initialFormikValues = {
  date: toServerDateFormat(Date.now()),
  message: ""
};

const validationSchema = object().shape({
  message: string().required()
});

const Component = ({ recordType, record, handleActiveTab }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [savingFlag, setSavingFlag] = useState(false);

  const path = Array.isArray(record) ? `${recordType}/flags` : `${recordType}/${record}/flags`;

  const inputProps = {
    component: TextField,
    fullWidth: true,
    InputLabelProps: {
      shrink: true
    },
    inputProps: {
      maxlength: MAX_LENGTH_FLAG_REASON
    },
    helperText: i18n.t("flags.flag_reason_maximun_label")
  };

  const dateInputProps = {
    fullWidth: true,
    InputLabelProps: {
      shrink: true
    },
    format: DATE_FORMAT,
    clearable: true,
    InputProps: {
      endAdornment: (
        <InputAdornment position="end">
          <CalendarTodayIcon />
        </InputAdornment>
      )
    }
  };

  const onReset = (data, actions) => {
    actions.resetForm(initialFormikValues);
    handleActiveTab(0);
    setSavingFlag(false);
  };

  const onSubmit = async (data, actions) => {
    setSavingFlag(true);
    const body = Array.isArray(record) ? { data: { data, record, record_type: recordType } } : { data };

    await dispatch(addFlag(body, i18n.t("flags.flag_added"), path));
    onReset(data, actions);
  };

  const formProps = {
    initialValues: initialFormikValues,
    validationSchema,
    onSubmit,
    onReset
  };

  return (
    <Box mx={4} mt={4}>
      <Formik {...formProps}>
        {({ handleSubmit, handleReset }) => (
          <Form onSubmit={handleSubmit}>
            <Box my={2}>
              <Field name="message" label={i18n.t("flags.flag_reason")} {...inputProps} autoFocus help />
            </Box>
            <Box my={2}>
              <Field
                name="date"
                render={({ field, form, ...other }) => {
                  const handleChangeFlagDate = date => {
                    const formattedDate = date ? toServerDateFormat(date) : date;

                    return form.setFieldValue(field.name, formattedDate, true);
                  };

                  return (
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localize(i18n)}>
                      <DatePicker
                        {...field}
                        label={i18n.t("flags.flag_date")}
                        value={field.value ? parseISO(field.value) : field.value}
                        onChange={handleChangeFlagDate}
                        {...dateInputProps}
                        {...other}
                      />
                    </MuiPickersUtilsProvider>
                  );
                }}
              />
            </Box>
            <div>
              <ActionButton
                icon={<CheckIcon />}
                text={i18n.t("buttons.save")}
                type={ACTION_BUTTON_TYPES.default}
                pending={savingFlag}
                rest={{
                  type: "submit",
                  disabled: savingFlag
                }}
              />
              <ActionButton
                icon={<CloseIcon />}
                text={i18n.t("buttons.cancel")}
                type={ACTION_BUTTON_TYPES.default}
                isCancel
                rest={{
                  onClick: handleReset
                }}
              />
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  handleActiveTab: PropTypes.func,
  record: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired
};

export default Component;
