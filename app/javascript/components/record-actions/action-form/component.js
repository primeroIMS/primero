import { useRef, useEffect } from "react";
import { batch, useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import PropTypes from "prop-types";

import ActionDialog from "../../action-dialog";
import { useI18n } from "../../i18n";
import { constructInitialValues } from "../../record-form";
import { ID_FIELD, MODULES, RECORD_TYPES } from "../../../config";
import { saveRecord, selectRecordsByIndexes } from "../../records";
import { compactBlank } from "../../record-form/utils";
import submitForm from "../../../libs/submit-form";
import resetForm from "../../../libs/reset-form";
import { fetchAlerts } from "../../nav/action-creators";
import { useMemoizedSelector } from "../../../libs";
import { useApp } from "../../application";
import { getRecordFormsByUniqueIdWithFallback } from "../../record-form/selectors";

function Component({
  checkVisible,
  includeRecordModuleID = false,
  skipRecordAlerts = false,
  creationMessage,
  dialogTitle,
  dialogName,
  formName,
  subFormName,
  recordAction,
  validationSchema,
  Fields,
  open,
  close,
  pending,
  recordType,
  selectedRowsIndex,
  setPending
}) {
  const formikRef = useRef();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { online } = useApp();

  const selectedRecords = useMemoizedSelector(state => selectRecordsByIndexes(state, recordType, selectedRowsIndex));
  const selectedIds = selectedRecords.map(record => record.get(ID_FIELD));

  const form = useMemoizedSelector(state =>
    getRecordFormsByUniqueIdWithFallback(state, {
      recordType: RECORD_TYPES[recordType],
      primeroModule: selectedRecords?.[0]?.get("module_id"),
      formName,
      checkVisible,
      fallbackModule: MODULES.CP
    })
  );

  useEffect(() => {
    if (open) {
      resetForm(formikRef);
    }
  }, [open]);

  if (form?.isEmpty()) {
    return [];
  }

  const { subform_section_id: subformSectionID, name: subformName } = form
    .first()
    .fields.find(field => field.name === subFormName);
  const initialFormValues = constructInitialValues([subformSectionID]);
  const successHandler = () => submitForm(formikRef);

  const modalProps = {
    confirmButtonLabel: i18n.t("buttons.save"),
    dialogTitle: i18n.t(dialogTitle),
    cancelHandler: close,
    onClose: close,
    open,
    pending,
    omitCloseAfterSuccess: true,
    successHandler
  };

  const fieldsProps = {
    ...(includeRecordModuleID && { recordModuleID: selectedRecords?.[0]?.get("module_id") }),
    recordType,
    fields: subformSectionID.toJS().fields
  };

  const formProps = {
    ...(validationSchema && { validationSchema: validationSchema(subformSectionID, { i18n, online }) }),
    initialValues: initialFormValues,
    validateOnBlur: false,
    validateOnChange: false,
    innerRef: formikRef,
    onSubmit: (values, { setSubmitting }) => {
      const body = {
        data: {
          [subformName]: [
            {
              ...compactBlank(values, initialFormValues)
            }
          ]
        },
        record_action: recordAction
      };

      setPending(true);
      selectedIds.forEach(id => {
        batch(() => {
          dispatch(
            saveRecord(
              recordType,
              "update",
              body,
              id,
              i18n.t(creationMessage),
              i18n.t("offline_submitted_changes"),
              false,
              false,
              dialogName,
              false,
              null,
              "",
              skipRecordAlerts
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
}

Component.displayName = "ActionForm";

Component.propTypes = {
  checkVisible: PropTypes.bool,
  close: PropTypes.func,
  creationMessage: PropTypes.string,
  dialogName: PropTypes.string,
  dialogTitle: PropTypes.string,
  Fields: PropTypes.element,
  formName: PropTypes.string,
  includeRecordModuleID: PropTypes.bool,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  recordAction: PropTypes.string,
  records: PropTypes.array,
  recordType: PropTypes.string,
  selectedRowsIndex: PropTypes.array,
  setPending: PropTypes.func,
  skipRecordAlerts: PropTypes.bool,
  subFormName: PropTypes.string,
  validationSchema: PropTypes.func
};

export default Component;
