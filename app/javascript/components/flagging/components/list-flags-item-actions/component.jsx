import PropTypes from "prop-types";
import { Divider, makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";

import { useI18n } from "../../../i18n";
import { ResolvedFlagIcon } from "../../../../images/primero-icons";
import { currentUser } from "../../../user";
import { FormAction } from "../../../form";
import styles from "../styles.css";
import { UNFLAG_DIALOG } from "../unflag/constants";
import { setSelectedFlag } from "../../action-creators";
import { useDialog } from "../../../action-dialog";
import { useMemoizedSelector } from "../../../../libs";

import { NAME } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({ flag }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const css = useStyles();

  const userName = useMemoizedSelector(state => currentUser(state));

  const showResolveButton =
    // eslint-disable-next-line camelcase
    !flag?.removed && userName === flag?.flagged_by;
  const { setDialog } = useDialog(UNFLAG_DIALOG);

  if (!flag) {
    return null;
  }

  const handleUnflagDialog = () => {
    dispatch(setSelectedFlag(flag.id));
    setDialog({ dialog: UNFLAG_DIALOG, open: true });
  };

  const renderFlagActions = showResolveButton && (
    <FormAction
      actionHandler={handleUnflagDialog}
      text={i18n.t("flags.resolve_button")}
      startIcon={<ResolvedFlagIcon fontSize="small" />}
    />
  );

  const renderActions = flag.removed ? (
    <div className={css.flagRemovedInfo}>
      <div className={css.date}>
        {i18n.t("flags.resolved_date")} {i18n.localizeDate(flag.unflagged_date)}
      </div>
      <div className={css.resolvedReason}>
        {i18n.t("flags.resolved_reason")} {flag.unflag_message}
      </div>
    </div>
  ) : (
    <div className={css.actions}>
      <div className={css.date}>
        {i18n.t("flags.date")} {i18n.localizeDate(flag.date)}
      </div>
      <div className={css.actionDivider}>
        <Divider orientation="vertical" classes={{ vertical: css.verticalDivider }} />
      </div>
      <div className={css.resolveButton}>{renderFlagActions}</div>
    </div>
  );

  return renderActions;
};

Component.displayName = NAME;

Component.propTypes = {
  flag: PropTypes.object.isRequired
};

export default Component;
