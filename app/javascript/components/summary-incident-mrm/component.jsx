import PropTypes from "prop-types";

import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";

import { NAME } from "./constants";
import css from "./styles.css";
import ViolationsSubforms from "./components/violations-subforms";
import SummaryFields from "./components/summary-fields";
import ChildrenMultipleViolations from "./components/children-multiple-violations";

const Component = ({ record, recordType, mobileDisplay, handleToggleNav, mode, formSections }) => {
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
      <SummaryFields mode={mode} />
      <ViolationsSubforms record={record} recordType={recordType} formSections={formSections} />
      <ChildrenMultipleViolations record={record} formSections={formSections} />
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  formSections: PropTypes.object.isRequired,
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  mode: PropTypes.object,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired
};

export default Component;
