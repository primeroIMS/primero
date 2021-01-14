/* eslint-disable react/display-name, react/no-multi-comp */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import pick from "lodash/pick";

import { useI18n } from "../../../../i18n";
import { getSubformValues } from "../../utils";
import SubformDrawer from "../subform-drawer";

import { TraceForm, TraceMatches } from "./components";
import { FORMS, NAME } from "./constants";

const Component = ({ openDrawer, field, formik, formSection, handleClose, index, recordType }) => {
  const i18n = useI18n();
  const [open, setOpen] = useState(openDrawer);
  const [selectedForm, setSelectedForm] = useState(FORMS.trace);
  const currentValues = formik.values;
  const traceValues = getSubformValues(field, index, currentValues);
  const tracingRequestValues = pick(currentValues, ["relation_name", "inquiry_date", "short_id"]);
  const title =
    selectedForm === FORMS.matches ? i18n.t("tracing_request.find_match") : i18n.t("tracing_request.traces");

  const getForm = () => {
    switch (selectedForm) {
      case FORMS.matches:
        return (
          <TraceMatches tracingRequestValues={tracingRequestValues} traceValues={traceValues} recordType={recordType} />
        );
      default:
        return (
          <TraceForm
            handleBack={handleClose}
            traceValues={traceValues}
            formSection={formSection}
            handleConfirm={() => setSelectedForm(FORMS.matches)}
          />
        );
    }
  };

  useEffect(() => {
    if (open) {
      setSelectedForm(FORMS.trace);
    }
    if (openDrawer !== open) {
      setOpen(openDrawer);
    }
  }, [openDrawer]);

  return (
    <SubformDrawer title={title} open={open} cancelHandler={handleClose}>
      {getForm()}
    </SubformDrawer>
  );
};

Component.propTypes = {
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  formSection: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  index: PropTypes.number,
  openDrawer: PropTypes.bool,
  recordType: PropTypes.string.isRequired
};

Component.displayName = NAME;

export default Component;
