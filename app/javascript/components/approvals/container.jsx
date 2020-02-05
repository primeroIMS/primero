import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";

import { useI18n } from "../i18n";

import styles from "./styles.css";
import { NAME } from "./constants";
import ApprovalPanel from "./components/panel";

const Container = ({ approvals }) => {
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
        <div className={css.formTitle}>
          <h1 className={css.formHeading}>
            {i18n.t("forms.record_types.approvals")}
          </h1>
        </div>
        {renderApprovals}
      </div>
    </div>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  approvals: PropTypes.object
};
export default Container;
