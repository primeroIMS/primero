import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form } from "formik";

import { ActionDialog } from "../../action-dialog";
import { useI18n } from "../../i18n";
import {
  getRecordFormsByUniqueId,
  constructInitialValues
} from "../../record-form";
import { MODULES, RECORD_TYPES, ID_FIELD } from "../../../config";
import { saveRecord, selectRecordsByIndexes } from "../../records";
import { compactValues } from "../../record-form/helpers";
import Fields from "../add-incident/fields";
import submitForm from "../../../libs/submit-form";
import resetForm from "../../../libs/reset-form";
import { ACTIONS } from "../../../libs/permissions";

import { NAME, SERVICES_SUBFORM } from "./constants";

const Component = ({
  openServiceDialog,
  close,
  recordType,
  selectedRowsIndex
}) => {
  const formikRef = useRef();
  const i18n = useI18n();
  const dispatch = useDispatch();

  const form = useSelector(state =>
    getRecordFormsByUniqueId(state, {
      recordType: RECORD_TYPES[recordType],
      primeroModule: MODULES.CP,
      formName: SERVICES_SUBFORM
    })
  );

  const selectedIds = useSelector(state =>
    selectRecordsByIndexes(state, recordType, selectedRowsIndex).map(record =>
      record.get(ID_FIELD)
    )
  );

  useEffect(() => {
    if (openServiceDialog) {
      resetForm(formikRef);
    }
  }, [openServiceDialog]);

  if (!form?.toJS()?.length) return [];

  const {
    subform_section_id: subformSectionID,
    name: subformName
  } = form.first().fields[0];
  const initialFormValues = constructInitialValues([subformSectionID]);

  const modalProps = {
    confirmButtonLabel: i18n.t("buttons.save"),
    confirmButtonProps: {
      color: "primary",
      variant: "contained",
      autoFocus: true
    },
    dialogTitle: i18n.t("actions.services_section_from_case"),
    onClose: close,
    open: openServiceDialog,
    successHandler: () => submitForm(formikRef)
  };

  const fieldsProps = {
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

      selectedIds.map(id =>
        dispatch(
          saveRecord(
            recordType,
            "update",
            body,
            id,
            i18n.t(`actions.services_from_case_creation_success`),
            false,
            false
          )
        )
      );
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
  openServiceDialog: PropTypes.bool,
  records: PropTypes.array,
  recordType: PropTypes.string,
  selectedRowsIndex: PropTypes.array
};

Component.displayName = NAME;

export default Component;
