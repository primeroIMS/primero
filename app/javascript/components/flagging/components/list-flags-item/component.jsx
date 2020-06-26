import React from "react";
import PropTypes from "prop-types";
import {
  ListItem,
  ListItemText,
  Divider,
  makeStyles,
  Fab
} from "@material-ui/core";
import FlagIcon from "@material-ui/icons/Flag";
import { useSelector } from "react-redux";

import { useI18n } from "../../../i18n";
import {
  UserArrowIcon,
  ResolvedFlagIcon
} from "../../../../images/primero-icons";
import { currentUser } from "../../../user";
import styles from "../styles.css";

import { NAME } from "./constants";

const Component = ({ flag, handleDelete }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const itemClass = flag?.removed ? css.itemResolved : css.item;
  const userName = useSelector(state => currentUser(state));
  const showResolveButton =
    // eslint-disable-next-line camelcase
    handleDelete && !flag?.removed && userName === flag?.flagged_by;

  if (!flag) {
    return null;
  }
  const renderFlagActions = showResolveButton && (
    <>
      <div className={css.actionDivider}>
        <Divider
          orientation="vertical"
          classes={{ vertical: css.verticalDivider }}
        />
      </div>
      <div className={css.resolveButton}>
        <Fab
          size="small"
          color="primary"
          variant="extended"
          aria-label="delete"
          onClick={() => handleDelete(flag.id)}
        >
          <ResolvedFlagIcon fontSize="small" />
          {i18n.t("flags.resolve")}
        </Fab>
      </div>
    </>
  );

  const renderActions = flag.removed ? (
    <div className={css.flagRemovedInfo}>
      <div className={css.date}>
        {i18n.t("flags.resolved_date")}{" "}
        {i18n.l("date.formats.default", flag.unflagged_date)}
      </div>
      <div className={css.resolvedReason}>
        {i18n.t("flags.resolved_reason")} {flag.unflag_message}
      </div>
    </div>
  ) : (
    <div className={css.actions}>
      <div className={css.date}>
        {i18n.t("flags.date")} {i18n.l("date.formats.default", flag.date)}
      </div>
      {renderFlagActions}
    </div>
  );

  return (
    <ListItem className={itemClass}>
      <ListItemText className={css.itemText}>
        <div className={css.wrapper}>
          <div className={css.flagInfo}>
            <div className={css.elementContent}>
              <FlagIcon />
              <span>{flag.message}</span>
            </div>
            <div className={css.flagUser}>
              <UserArrowIcon className={css.rotateIcon} />
              <span>{flag.flagged_by}</span>
            </div>
          </div>
          {renderActions}
        </div>
      </ListItemText>
    </ListItem>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  flag: PropTypes.object.isRequired,
  handleDelete: PropTypes.func
};

export default Component;
