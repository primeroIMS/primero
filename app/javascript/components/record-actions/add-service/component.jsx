import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { batch, useDispatch } from "react-redux";
import { Formik, Form } from "formik";

import ActionDialog from "../../action-dialog";
import { useI18n } from "../../i18n";
import { getRecordFormsByUniqueId, constructInitialValues } from "../../record-form";
import { MODULES, RECORD_TYPES, ID_FIELD } from "../../../config";
import { saveRecord, selectRecordsByIndexes } from "../../records";
import { compactValues } from "../../record-form/utils";
import Fields from "../add-incident/fields";
import submitForm from "../../../libs/submit-form";
import resetForm from "../../../libs/reset-form";
import { ACTIONS } from "../../../libs/permissions";
import { fetchAlerts } from "../../nav/action-creators";
import { SERVICE_DIALOG } from "../constants";
import { useMemoizedSelector } from "../../../libs";

import { NAME, SERVICES_SUBFORM, SERVICES_SUBFORM_NAME } from "./constants";

const Component = ({ open, close, pending, recordType, selectedRowsIndex, setPending }) => {
  const formikRef = useRef();
  const i18n = useI18n();
  const dispatch = useDispatch();

  const form = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, {
      recordType: RECORD_TYPES[recordType],
      primeroModule: MODULES.CP,
      formName: SERVICES_SUBFORM
    })
  );
  const selectedIds = useMemoizedSelector(state =>
    selectRecordsByIndexes(state, recordType, selectedRowsIndex).map(record => record.get(ID_FIELD))
  );

  useEffect(() => {
    if (open) {
      resetForm(formikRef);
    }
  }, [open]);

  if (form?.isEmpty()) return [];

  const { subform_section_id: subformSectionID, name: subformName } = form
    .first()
    .fields.find(field => field.name === SERVICES_SUBFORM_NAME);
  const initialFormValues = constructInitialValues([subformSectionID]);
  const successHandler = () => submitForm(formikRef);

  const modalProps = {
    confirmButtonLabel: i18n.t("buttons.save"),
    dialogTitle: i18n.t("actions.services_section_from_case"),
    cancelHandler: close,
    onClose: close,
    open,
    pending,
    omitCloseAfterSuccess: true,
    successHandler
  };

  const fieldsProps = {
    recordModuleID: MODULES.CP,
    recordType,
    fields: subformSectionID.toJS().fields
  };

  const formProps = {
    initialValues: initialFormValues,
    validateOnBlur: false,
    validateOnChange: false,
    ref: formikRef,
    onSubmit: (values, { setSubmitting }) => {
      const body = {
        data: {
          [subformName]: [
            {
              ...compactValues(values, initialFormValues)
            }
          ]
        },
        record_action: ACTIONS.SERVICES_SECTION_FROM_CASE
      };

      setPending(true);
      selectedIds.forEach(id => {
        batch(async () => {
          await dispatch(
            saveRecord(
              recordType,
              "update",
              body,
              id,
              i18n.t(`actions.services_from_case_creation_success`),
              i18n.t("offline_submitted_changes"),
              false,
              false,
              SERVICE_DIALOG
            )
          );
        });
      });
      dispatch(fetchAlerts());
      setSubmitting(false);
    }
  };

  return (
    <Formik {...formProps}>
      <ActionDialog {...modalProps}>
        <Form noValidate autoComplete="off">
          <Fields {...fieldsProps} />
        </Form>
      </ActionDialog>
    </Formik>
  );
};

Component.propTypes = {
  close: PropTypes.func,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  records: PropTypes.array,
  recordType: PropTypes.string,
  selectedRowsIndex: PropTypes.array,
  setPending: PropTypes.func
};

Component.displayName = NAME;

export default Component;
