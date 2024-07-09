// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Divider } from "@mui/material";
import { useDispatch } from "react-redux";

import { useI18n } from "../../../i18n";
import { ResolvedFlagIcon } from "../../../../images/primero-icons";
import { currentUser } from "../../../user";
import { FormAction } from "../../../form";
import css from "../styles.css";
import { UNFLAG_DIALOG } from "../unflag/constants";
import { setSelectedFlag } from "../../action-creators";
import { useDialog } from "../../../action-dialog";
import { useMemoizedSelector } from "../../../../libs";
import DateFlag from "../../../transitions/components/date-transitions-summary";
import { usePermissions, FLAG_RESOLVE_ANY } from "../../../permissions";

import { NAME } from "./constants";

function Component({ flag }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const canResolveAnyFlag = usePermissions(flag?.record_type, FLAG_RESOLVE_ANY);

  const userName = useMemoizedSelector(state => currentUser(state));

  const showResolveButton =
    // eslint-disable-next-line camelcase
    !flag?.removed && (userName === flag?.flagged_by || canResolveAnyFlag);
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
        {i18n.t("flags.resolved_date")}
        <DateFlag value={flag.unflagged_date} />
      </div>
      <div className={css.resolvedReason}>
        {i18n.t("flags.resolved_reason")} {flag.unflag_message}
      </div>
    </div>
  ) : (
    <div className={css.actions}>
      <div className={css.date}>
        {i18n.t("flags.date")}
        <DateFlag value={flag.date} />
      </div>
      <div className={css.actionDivider}>
        <Divider orientation="vertical" classes={{ vertical: css.verticalDivider }} />
      </div>
      <div className={css.resolveButton}>{renderFlagActions}</div>
    </div>
  );

  return renderActions;
}

Component.displayName = NAME;

Component.propTypes = {
  flag: PropTypes.object.isRequired
};

export default Component;
