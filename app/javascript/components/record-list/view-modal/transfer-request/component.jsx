import { createRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { object, string } from "yup";

import ActionDialog from "../../../action-dialog";
import { useI18n } from "../../../i18n";
import { getErrors, getLoading } from "../../selectors";
import { useMemoizedSelector } from "../../../../libs";

import { NAME, NOTES_FIELD } from "./constants";
import RequestForm from "./request-form";
import { saveTransferRequest } from "./action-creators";
import NAMESPACE from "./namespace";

const TransferRequest = ({ open, setOpen, currentRecord, caseId }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const formikRef = createRef();

  const loading = useMemoizedSelector(state => getLoading(state, ["transitions", NAMESPACE]));
  const errors = useMemoizedSelector(state => getErrors(state, ["transitions", NAMESPACE]));

  const close = () => setOpen(false);

  const handleFormSubmit = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  const validationSchema = object().shape({
    [NOTES_FIELD]: string().required()
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
    // eslint-disable-next-line react/no-multi-comp, react/display-name
    render: props => <RequestForm formProps={props} record={currentRecord} />,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema
  };

  useEffect(() => {
    const { submitCount } = formikRef.current?.getFormikBag() || {};

    if (!loading && !errors && submitCount > 0) {
      close();
    }
  }, [loading, errors]);

  return (
    <>
      <ActionDialog
        open={open}
        successHandler={handleFormSubmit}
        cancelHandler={close}
        onClose={close}
        dialogTitle={caseId}
        confirmButtonLabel={i18n.t("request_transfer.submit_label")}
        omitCloseAfterSuccess
        pending={loading}
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
