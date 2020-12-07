import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import omitBy from "lodash/omitBy";
import isEmpty from "lodash/isEmpty";

import ActionDialog from "../../../../../action-dialog";
import bindFormSubmit from "../../../../../../libs/submit-form";
import Form from "../../../../../form";
import { exportForms } from "../../action-creators";
import { getExportedForms } from "../../selectors";

import validations from "./validations";
import { NAME, EXPORT_TYPES, EXPORTED_URL } from "./constants";
import { form } from "./form";

const Component = ({ close, filters, i18n, open, pending, setPending }) => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const { recordType, primeroModule } = filters;
  const dialogPending = typeof pending === "object" ? pending.get("pending") : pending;
  const exportedForms = useSelector(state => getExportedForms(state));

  const onSubmit = data => {
    const params = {
      ...data,
      export_type: EXPORT_TYPES.EXCEL,
      record_type: recordType,
      module_id: primeroModule
    };

    setPending(true);
    dispatch(exportForms({ params: omitBy(params, isEmpty), message: i18n.t("form_export.success_message") }));
  };

  useEffect(() => {
    if (exportedForms.size > 0 && !isEmpty(exportedForms.get(EXPORTED_URL))) {
      window.open(exportedForms.get(EXPORTED_URL));
    }
  }, [exportedForms]);

  return (
    <ActionDialog
      open={open}
      successHandler={() => bindFormSubmit(formRef)}
      cancelHandler={() => close()}
      dialogTitle={i18n.t("form_export.label")}
      confirmButtonLabel={i18n.t("buttons.export")}
      pending={dialogPending}
      omitCloseAfterSuccess
    >
      <Form
        useCancelPrompt
        mode="new"
        formSections={form(i18n)}
        onSubmit={onSubmit}
        ref={formRef}
        validations={validations(i18n)}
      />
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  filters: PropTypes.object,
  i18n: PropTypes.object,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  setPending: PropTypes.func
};

export default Component;
