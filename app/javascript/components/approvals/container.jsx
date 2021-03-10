import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";

import styles from "./styles.css";
import { NAME } from "./constants";
import ApprovalPanel from "./components/panel";

const useStyles = makeStyles(styles);

const Container = ({ approvals, mobileDisplay, handleToggleNav }) => {
  const css = useStyles();
  const i18n = useI18n();

  const renderApprovals =
    approvals &&
    approvals.map((approvalSubform, index) => (
      <ApprovalPanel
        key={approvalSubform.get("unique_id") || `${approvalSubform.get("approval_requested_for")}-${index}`}
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
