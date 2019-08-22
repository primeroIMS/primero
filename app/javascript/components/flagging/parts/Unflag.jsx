import React from "react";
import PropTypes from "prop-types";
import { Formik, Field } from "formik";
import { TextField } from "formik-material-ui";
import { Button, Box, Divider } from "@material-ui/core";
import { useI18n } from "components/i18n";

const Unflag = ({ flag, setDeleteFlag }) => {
  const i18n = useI18n();

  const inputProps = {
    component: TextField,
    multiline: true,
    fullWidth: true,
    autoFocus: true,
    InputLabelProps: {
      shrink: true
    }
  };

  const onSubmit = data => {
    console.log({ id: flag.id, ...data });
  };

  const handleCancel = () => {
    setDeleteFlag({ deleteMode: false, id: "" });
  };

  const formProps = {
    initialValues: {
      unflag_message: ""
    },
    onSubmit
  };

  return (
    <Formik {...formProps}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
          <Box px={2}>
            <Field
              name="unflag_message"
              label={i18n.t("flags.flag_reason")}
              {...inputProps}
            />
            <Divider />
            <Box display="flex" my={3} justifyContent="flex-end">
              <Button onClick={handleCancel}>{i18n.t("buttons.cancel")}</Button>
              <Button type="submit">{i18n.t("buttons.save")}</Button>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );
};

Unflag.propTypes = {
  flag: PropTypes.object.isRequired,
  setDeleteFlag: PropTypes.func.isRequired
};

export default Unflag;
