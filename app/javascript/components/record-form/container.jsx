import React, { useEffect, memo } from "react";
import PropTypes from "prop-types";
import { LinearProgress } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import { enqueueSnackbar } from "components/notifier";
import { useI18n } from "components/i18n";
import { PageContainer } from "components/page-container";
import { Nav } from "./nav";
import NAMESPACE from "./namespace";
import { RecordForm, RecordFormToolbar } from "./form";
import styles from "./styles.css";
import { fetchRecord, saveRecord } from "./action-creators";
import {
  getFirstTab,
  getFormNav,
  getRecordForms,
  getRecord
} from "./selectors";
import { RECORD_TYPES } from "./constants";
import { compactValues } from "./helpers";

const RecordForms = ({ match, mode }) => {
  let submitForm = null;

  const containerMode = {
    isNew: mode === "new",
    isEdit: mode === "edit",
    isShow: mode === "show"
  };

  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const i18n = useI18n();
  const { params } = match;
  const recordType = RECORD_TYPES[params.recordType];

  const record =
    containerMode.isEdit || containerMode.isShow
      ? useSelector(state => getRecord(state))
      : null;

  const selectedModule = {
    recordType,
    primeroModule: record ? record.get("module_id") : params.module
  };

  const formNav = useSelector(state => getFormNav(state, selectedModule));
  const forms = useSelector(state => getRecordForms(state, selectedModule));
  const firstTab = useSelector(state => getFirstTab(state, selectedModule));

  const selectedForm = useSelector(state =>
    state.getIn([NAMESPACE, "selectedForm"])
  );

  const handleFormSubmit = e => {
    if (submitForm) {
      submitForm(e);
    }
  };

  const formProps = {
    onSubmit: (initialValues, values, setSubmitting) => {
      dispatch(
        saveRecord(
          params.recordType,
          containerMode.isEdit ? "update" : "save",
          {
            data: {
              ...compactValues(values, initialValues),
              module_id: selectedModule.primeroModule
            }
          },
          params.id,
          () => {
            dispatch(
              enqueueSnackbar(
                containerMode.isEdit
                  ? i18n.t(`${recordType}.messages.update_success`, {
                      record_id: record.get("short_id")
                    })
                  : i18n.t(
                      `${recordType}.messages.creation_success`,
                      recordType
                    ),
                "success"
              )
            );
          }
        )
      );
      setSubmitting(false);
    },
    bindSubmitForm: boundSubmitForm => {
      submitForm = boundSubmitForm;
    },
    selectedForm,
    forms,
    mode: containerMode,
    record
  };

  const toolbarProps = {
    mode: containerMode,
    params,
    recordType,
    handleFormSubmit,
    shortId: record ? record.get("short_id") : null
  };

  const navProps = {
    formNav,
    selectedForm,
    firstTab
  };

  useEffect(() => {
    if (params.id && (containerMode.isShow || containerMode.isEdit)) {
      dispatch(fetchRecord(params.recordType, params.id));
    }
  }, []);

  return (
    <PageContainer twoCol>
      <RecordFormToolbar {...toolbarProps} />
      <div className={css.recordContainer}>
        <div className={css.recordNav}>
          {formNav && firstTab ? <Nav {...navProps} /> : <LinearProgress />}
        </div>
        <div className={css.recordForms}>
          {forms ? <RecordForm {...formProps} /> : <LinearProgress />}
        </div>
      </div>
    </PageContainer>
  );
};

RecordForms.propTypes = {
  match: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired
};

export default memo(withRouter(RecordForms));
