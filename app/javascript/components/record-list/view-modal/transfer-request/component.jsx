import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";

import { ActionDialog } from "../../../action-dialog";
import { useI18n } from "../../../i18n";

import { NAME, NOTES_FIELD } from "./constants";
import RequestForm from "./request-form";
import { saveTransferRequest } from "./action-creator";

const TransferRequest = ({ open, setOpen, currentRecord, caseId }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const formikRef = React.createRef();

  const close = () => setOpen(false);

  const confirmButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true,
    type: "submit"
  };

  const handleFormSubmit = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  const validationSchema = yup.object().shape({
    [NOTES_FIELD]: yup.string().required()
  });

  const formikProps = {
    initialValues: { [NOTES_FIELD]: "" },
    onSubmit: (values, { setSubmitting }) => {
      dispatch(
        saveTransferRequest(
          currentRecord.get("id"),
          {
            data: values
          },
          i18n.t("request_transfer.success")
        )
      );
      setSubmitting(false);
    },
    ref: formikRef,
    render: props => <RequestForm formProps={props} record={currentRecord} />,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema
  };

  return (
    <>
      <ActionDialog
        open={open}
        successHandler={handleFormSubmit}
        cancelHandler={close}
        onClose={close}
        dialogTitle={caseId}
        confirmButtonLabel={i18n.t("request_transfer.submit_label")}
        confirmButtonProps={confirmButtonProps}
      >
        <Formik {...formikProps} />
      </ActionDialog>
    </>
  );
};

TransferRequest.displayName = NAME;

TransferRequest.propTypes = {
  caseId: PropTypes.string.isRequired,
  currentRecord: PropTypes.object,
  open: PropTypes.bool,
  setOpen: PropTypes.func
};

export default TransferRequest;
