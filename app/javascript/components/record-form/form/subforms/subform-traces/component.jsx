/* eslint-disable react/display-name, react/no-multi-comp */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import pick from "lodash/pick";

import { useI18n } from "../../../../i18n";
import { useMemoizedSelector } from "../../../../../libs";
import { getSubformValues } from "../../utils";
import { getSelectedPotentialMatch } from "../../../../records/selectors";
import SubformDrawer from "../subform-drawer";

import { TraceComparisonForm, TraceForm, TraceMatches } from "./components";
import { FORMS, NAME } from "./constants";

const Component = ({ openDrawer, field, formik, formSection, handleClose, index, recordType, mode }) => {
  const i18n = useI18n();
  const [open, setOpen] = useState(openDrawer);
  const [selectedForm, setSelectedForm] = useState(FORMS.trace);

  const selectedPotentialMatch = useMemoizedSelector(state => getSelectedPotentialMatch(state, recordType));

  const currentValues = formik.values;
  const traceValues = getSubformValues(field, index, currentValues);
  const tracingRequestValues = pick(currentValues, ["relation_name", "inquiry_date", "short_id"]);
  const title =
    selectedForm === FORMS.matches ? i18n.t("tracing_request.find_match") : i18n.t("tracing_request.traces");

  useEffect(() => {
    if (selectedPotentialMatch?.toSeq()?.size) {
      setSelectedForm(FORMS.comparison);
    }
  }, [selectedPotentialMatch]);

  const props = {
    traceValues,
    tracingRequestValues,
    recordType,
    potentialMatch: selectedPotentialMatch,
    setSelectedForm,
    handleClose,
    selectedForm,
    formSection,
    mode
  };

  const Form = (() => {
    switch (selectedForm) {
      case FORMS.matches:
        return TraceMatches;
      case FORMS.comparison:
        return TraceComparisonForm;
      default:
        return TraceForm;
    }
  })();

  useEffect(() => {
    if (openDrawer !== open) {
      setOpen(openDrawer);
    }
  }, [openDrawer]);

  useEffect(() => {
    if (open) {
      setSelectedForm(FORMS.trace);
    }
  }, [open]);

  return (
    <SubformDrawer title={title} open={open} cancelHandler={handleClose}>
      <Form {...props} />
    </SubformDrawer>
  );
};

Component.propTypes = {
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  formSection: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  index: PropTypes.number,
  mode: PropTypes.object,
  openDrawer: PropTypes.bool,
  recordType: PropTypes.string.isRequired
};

Component.displayName = NAME;

export default Component;
