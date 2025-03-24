// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";

import css from "./styles.css";
import { NAME } from "./constants";
import ApprovalPanel from "./components/panel";

function Container({ approvals, mobileDisplay, handleToggleNav, primeroModule }) {
  const i18n = useI18n();

  const renderApprovals =
    approvals &&
    approvals.map((approvalSubform, index) => (
      <ApprovalPanel
        key={approvalSubform.get("unique_id") || `${approvalSubform.get("approval_requested_for")}-${index}`}
        approvalSubform={approvalSubform}
        css={css}
        primeroModule={primeroModule}
      />
    ));

  return (
    <div data-testid="approvals">
      <div key="approvals-div">
        <RecordFormTitle
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
          displayText={i18n.t("forms.record_types.approvals")}
        />
        {renderApprovals}
      </div>
    </div>
  );
}

Container.displayName = NAME;

Container.propTypes = {
  approvals: PropTypes.object,
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  primeroModule: PropTypes.string
};
export default Container;
