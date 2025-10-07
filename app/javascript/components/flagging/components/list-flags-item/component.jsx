// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { ListItem, ListItemText, Divider } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import { cx } from "@emotion/css";
import { useDispatch } from "react-redux";

import { UserArrowIcon } from "../../../../images/primero-icons";
import css from "../styles.css";
import ListFlagsItemActions from "../list-flags-item-actions";
import { usePermissions } from "../../../permissions";
import { FLAG_UPDATE } from "../../../permissions/constants";
import { UPDATE_FLAG_DIALOG } from "../update-flag/constants";
import { useDialog } from "../../../action-dialog";
import { setSelectedFlag } from "../../action-creators";

import { NAME } from "./constants";

function Component({ flag }) {
  const dispatch = useDispatch();
  const { setDialog } = useDialog(UPDATE_FLAG_DIALOG);
  const canUpdateFlag = usePermissions(flag?.record_type, FLAG_UPDATE);

  const itemClass = cx({
    [css.itemResolved]: flag?.removed,
    [css.item]: !flag?.removed,
    [css.itemForbidden]: !canUpdateFlag
  });

  const handleClick = () => {
    if (canUpdateFlag) {
      dispatch(setSelectedFlag(flag.id));
      setDialog({ dialog: UPDATE_FLAG_DIALOG, open: true });
    }
  };

  if (!flag) {
    return null;
  }

  return (
    <>
      <ListItem className={itemClass} onClick={handleClick} data-testid="list-flags-item">
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
            <ListFlagsItemActions flag={flag} />
          </div>
        </ListItemText>
      </ListItem>
      <Divider component="li" />
    </>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  flag: PropTypes.object.isRequired
};

export default Component;
