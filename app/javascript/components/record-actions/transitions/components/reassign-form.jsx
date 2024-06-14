// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { object, string } from "yup";
import { Formik, Field, Form } from "formik";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import qs from "qs";
import { TextField } from "formik-mui";
import { fromJS } from "immutable";

import { RECORD_TYPES } from "../../../../config";
import { getUsersByTransitionType, getErrorsByTransitionType } from "../selectors";
import { saveAssignedUser, fetchAssignUsers } from "../action-creators";
import { saveBulkAssignedUser } from "../../bulk-transtions/action-creators";
import SearchableSelect from "../../../searchable-select";
import { enqueueSnackbar } from "../../../notifier";
import { useI18n } from "../../../i18n";
import { applyFilters } from "../../../index-filters/action-creators";
import { filterUsers } from "../utils";
import { useMemoizedSelector } from "../../../../libs";
import { getFiltersValuesByRecordType } from "../../../index-filters/selectors";
import { getMetadata } from "../../../record-list/selectors";
import InternalAlert, { SEVERITY } from "../../../internal-alert";

import { REASSIGN_FORM_NAME } from "./constants";
import { searchableValue, buildDataAssign } from "./utils";
import css from "./styles.css";

const initialValues = { transitioned_to: "", notes: "" };

const ReassignForm = ({
  record,
  recordType,
  setPending,
  assignRef,
  selectedIds,
  mode,
  selectedRecordsLength,
  currentRecordsSize,
  formDisabled = false
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = qs.parse(location.search.replace("?", ""));
  const transitionType = "reassign";

  const firstUpdate = useRef(true);

  useEffect(() => {
    dispatch(fetchAssignUsers(RECORD_TYPES[recordType]));
  }, []);

  const users = useMemoizedSelector(state => getUsersByTransitionType(state, transitionType));
  const hasErrors = useMemoizedSelector(state => getErrorsByTransitionType(state, transitionType));
  const appliedFilters = useMemoizedSelector(state => getFiltersValuesByRecordType(state, recordType));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));

  const totalRecords = metadata?.get("total", 0);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;

      return;
    }
    const messages = hasErrors
      .valueSeq()
      .map(e => i18n.t(e))
      .join(", ");

    if (messages !== "") {
      dispatch(enqueueSnackbar(messages, { type: "error" }));
    }
  }, [hasErrors]);

  const validationSchema = object().shape({
    transitioned_to: string().required(i18n.t("reassign.user_mandatory_label"))
  });

  const inputProps = {
    component: TextField,
    label: i18n.t("reassign.notes_label"),
    fullWidth: true,
    InputLabelProps: {
      shrink: true
    },
    disabled: formDisabled,
    autoComplete: "off",
    variant: "outlined",
    multiline: true,
    type: "text",
    rows: 4
  };

  const searchableSelectProps = {
    id: "transitioned_to",
    name: "transitioned_to",
    TextFieldProps: {
      label: i18n.t("reassign.users_label"),
      InputLabelProps: {
        htmlFor: "transitioned_to",
        shrink: true
      }
    },
    excludeEmpty: true,
    isDisabled: formDisabled,
    options: filterUsers(users, mode, record, true)
  };

  const handleAssign = (values, { setSubmitting }) => {
    const data = buildDataAssign({
      values,
      selectedIds,
      record,
      selectedRecordsLength,
      currentRecordsSize,
      totalRecords,
      appliedFilters,
      queryParams
    });

    setPending(true);
    if (record) {
      dispatch(saveAssignedUser(recordType, record.get("id"), { data }, i18n.t("reassign.successfully")));
    } else {
      dispatch(saveBulkAssignedUser(recordType, selectedIds, selectedRecordsLength, { data }));
    }
    setSubmitting(false);
    dispatch(
      applyFilters({
        recordType,
        data: appliedFilters
      })
    );
  };

  const handleTransitionedTo = (data, form, field) => {
    form.setFieldValue(field.name, data?.value || [], false);
  };

  const formProps = {
    initialValues,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: handleAssign,
    innerRef: assignRef
  };

  const internalAlert = formDisabled && (
    <InternalAlert
      items={fromJS([
        {
          message: i18n.t("reassign.incident_from_case_warning")
        }
      ])}
      severity={SEVERITY.info}
    />
  );

  return (
    <Formik {...formProps}>
      {({ handleSubmit }) => {
        return (
          <Form onSubmit={handleSubmit}>
            {internalAlert}
            <div className={css.field}>
              <Field name="transitioned_to">
                {({ field, form, ...other }) => {
                  const handleChange = data => handleTransitionedTo(data, form, field);

                  return (
                    <>
                      <SearchableSelect
                        defaultValues={searchableValue(field, searchableSelectProps.options, false)}
                        onChange={handleChange}
                        {...searchableSelectProps}
                        {...other}
                        onBlur={field.onBlur}
                      />
                      {form.touched[field.name] && form.errors[field.name] && (
                        <div className="MuiFormHelperText-root Mui-error">{form.errors[field.name]}</div>
                      )}
                    </>
                  );
                }}
              </Field>
            </div>
            <div className={css.field}>
              <Field name="notes" {...inputProps} />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

ReassignForm.displayName = REASSIGN_FORM_NAME;

ReassignForm.propTypes = {
  assignRef: PropTypes.object,
  currentRecordsSize: PropTypes.number,
  formDisabled: PropTypes.bool,
  formik: PropTypes.object,
  mode: PropTypes.object,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedIds: PropTypes.array,
  selectedRecordsLength: PropTypes.number,
  setPending: PropTypes.func
};

export default ReassignForm;
