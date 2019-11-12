import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";
import PropTypes from "prop-types";
import { compact } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle
} from "@material-ui/core";

import { applyFilters } from "../filters-builder/action-creators";
import { enqueueSnackbar } from "../notifier";
import { getFiltersByRecordType } from "../filters-builder/selectors";
import { selectModules } from "../pages/login/selectors";
import { useI18n } from "../i18n";

import { saveSearch } from "./action-creators";
import { buildFiltersApi } from "./helpers";

const initialValues = { name: "" };

const FormErrors = () => {
  const dispatch = useDispatch();
  const i18n = useI18n();

  useEffect(() => {
    dispatch(enqueueSnackbar(i18n.t("saved_search.no_filters"), "error"));
  }, [dispatch, i18n]);

  return null;
};

const SavedSearchesForm = ({ recordType, open, setOpen }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = useState(false);

  const selectedFilters = useSelector(state =>
    getFiltersByRecordType(state, recordType)
  );

  const userModules = useSelector(state => selectModules(state));

  const closeModal = () => {
    setOpen(false);
    setFormErrors(false);
  };

  const handleSaveSearches = (values, actions) => {
    if (selectedFilters) {
      const filters = buildFiltersApi(Object.entries(selectedFilters)).filter(
        f => Object.keys(f).length
      );

      if (filters.length) {
        const body = {
          data: {
            name: values.name,
            record_type: recordType,
            module_ids: userModules.toJS(),
            filters: compact(filters)
          }
        };

        dispatch(saveSearch(body, i18n.t("saved_search.save_success")));
        actions.resetForm(initialValues);
        setFormErrors(false);
        closeModal();
        dispatch(
          applyFilters({
            namespace: recordType,
            options: selectedFilters,
            path: `/${recordType.toLowerCase()}`
          })
        );
      } else {
        actions.setSubmitting(false);
        setFormErrors(true);
      }
    }
  };

  const inputProps = {
    component: TextField,
    autoFocus: true,
    required: true,
    fullWidth: true
  };

  const formProps = {
    initialValues,
    onSubmit: handleSaveSearches
  };

  return (
    <Formik {...formProps}>
      {({ handleSubmit }) => (
        <Dialog open={open} onClose={closeModal} maxWidth="sm" fullWidth>
          <DialogTitle id="form-dialog-title">
            {i18n.t("saved_searches.save_search")}
          </DialogTitle>
          <DialogContent>
            <Form onSubmit={handleSubmit}>
              <Field name="name" placeholder="Name..." {...inputProps} />
              {formErrors && <FormErrors />}
              <Box
                display="flex"
                my={3}
                justifyContent="flex-end"
                style={{ marginBottom: "5" }}
              >
                <Button onClick={closeModal} color="primary">
                  {i18n.t("buttons.cancel")}
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {i18n.t("buttons.save")}
                </Button>
              </Box>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </Formik>
  );
};

SavedSearchesForm.propTypes = {
  open: PropTypes.bool.isRequired,
  recordType: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired
};

export default SavedSearchesForm;
