import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { object, string } from "yup";
import { Formik, Field, Form } from "formik";
import { useDispatch } from "react-redux";
import { TextField } from "formik-material-ui";
import isEmpty from "lodash/isEmpty";

import { RECORD_TYPES } from "../../../../config";
import { getUsersByTransitionType, getErrorsByTransitionType } from "../selectors";
import { saveAssignedUser, fetchAssignUsers } from "../action-creators";
import { saveBulkAssignedUser } from "../../bulk-transtions/action-creators";
import SearchableSelect from "../../../searchable-select";
import { enqueueSnackbar } from "../../../notifier";
import { useI18n } from "../../../i18n";
import { applyFilters } from "../../../index-filters/action-creators";
import { DEFAULT_FILTERS } from "../../../record-list/constants";
import { filterUsers } from "../utils";
import { useMemoizedSelector } from "../../../../libs";

import { REASSIGN_FORM_NAME } from "./constants";
import { searchableValue } from "./utils";

const initialValues = { transitioned_to: "", notes: "" };

const ReassignForm = ({ record, recordType, setPending, assignRef, selectedIds, mode }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const transitionType = "reassign";

  const firstUpdate = useRef(true);

  useEffect(() => {
    dispatch(fetchAssignUsers(RECORD_TYPES[recordType]));
  }, []);

  const users = useMemoizedSelector(state => getUsersByTransitionType(state, transitionType));
  const hasErrors = useMemoizedSelector(state => getErrorsByTransitionType(state, transitionType));

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
    autoComplete: "off"
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
    options: filterUsers(users, mode, record, true)
  };

  const handleAssign = (values, { setSubmitting }) => {
    const data = isEmpty(selectedIds) ? values : { ...values, ids: selectedIds };

    setPending(true);
    if (record) {
      dispatch(saveAssignedUser(record.get("id"), { data }, i18n.t("reassign.successfully")));
    } else {
      dispatch(saveBulkAssignedUser(recordType, selectedIds, { data }));
    }
    setSubmitting(false);
    dispatch(
      applyFilters({
        recordType,
        data: DEFAULT_FILTERS
      })
    );
  };

  const handleTransitionedTo = (data, form, field) => {
    form.setFieldValue(field.name, data?.value || [], false);
  };

  const formProps = {
    initialValues,
    validationSchema,
    onSubmit: handleAssign,
    ref: assignRef
  };

  return (
    <Formik {...formProps}>
      {({ handleSubmit }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Field
              name="transitioned_to"
              render={({ field, form, ...other }) => {
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
            />
            <br />
            <Field name="notes" {...inputProps} />
          </Form>
        );
      }}
    </Formik>
  );
};

ReassignForm.displayName = REASSIGN_FORM_NAME;

ReassignForm.propTypes = {
  assignRef: PropTypes.object,
  formik: PropTypes.object,
  mode: PropTypes.object,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedIds: PropTypes.array,
  setPending: PropTypes.func
};

export default ReassignForm;
