import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";

import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";

import styles from "./styles.css";
import { NAME } from "./constants";
import ApprovalPanel from "./components/panel";

const Container = ({ approvals, mobileDisplay, handleToggleNav }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const renderApprovals =
    approvals &&
    approvals.map(approvalSubform => (
      <ApprovalPanel
        key={approvalSubform.get("unique_id")}
        approvalSubform={approvalSubform}
        css={css}
      />
    ));

  return (
    <div>
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
};

Container.displayName = NAME;

Container.propTypes = {
  approvals: PropTypes.object,
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired
};
export default Container;
