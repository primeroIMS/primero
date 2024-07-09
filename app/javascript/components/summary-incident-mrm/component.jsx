// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";

import { NAME } from "./constants";
import css from "./styles.css";
import ViolationsSubforms from "./components/violations-subforms";
import SummaryFields from "./components/summary-fields";
import ChildrenMultipleViolations from "./components/children-multiple-violations";

function Component({ recordID, recordType, mobileDisplay, handleToggleNav, mode, formSections, values }) {
  const i18n = useI18n();

  return (
    <div>
      <div className={css.container}>
        <RecordFormTitle
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
          displayText={i18n.t("incidents.summary_mrm.label")}
        />
      </div>
      <SummaryFields mode={mode} recordID={recordID} recordType={recordType} />
      <ViolationsSubforms recordType={recordType} formSections={formSections} values={values} />
      <ChildrenMultipleViolations recordType={recordType} formSections={formSections} values={values} />
    </div>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  formSections: PropTypes.object.isRequired,
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  mode: PropTypes.object,
  recordID: PropTypes.string,
  recordType: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired
};

export default Component;
