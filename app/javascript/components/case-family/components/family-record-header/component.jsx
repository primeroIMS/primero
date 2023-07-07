import PropTypes from "prop-types";
import { List, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";

import { useApp } from "../../../application";
import { ConditionalWrapper, useThemeHelper } from "../../../../libs";
import DisableOffline from "../../../disable-offline";
import css from "../../../record-form/form/subforms/styles.css";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../../action-button";
import { FAMILY_ID_DISPLAY, FAMILY_NAME, FAMILY_NUMBER } from "../../constants";

function Component({ handleOpenMatch, record }) {
  const { online } = useApp();
  const { isRTL } = useThemeHelper();

  return (
    <List dense classes={{ root: css.list }} disablePadding>
      <ConditionalWrapper
        condition={!record.get("complete", false) && !online}
        wrapper={DisableOffline}
        offlineTextKey="unavailable_offline"
      >
        <ListItem component="a" onClick={handleOpenMatch} classes={{ root: css.listItem }}>
          <ListItemText classes={{ primary: css.listText, secondary: css.listTextSecondary }}>
            <div className={css.listItemText}>
              <span>{record.get(FAMILY_ID_DISPLAY)}</span>
              <span>{record.get(FAMILY_NUMBER)}</span>
              <span>{record.get(FAMILY_NAME)}</span>
            </div>
          </ListItemText>
          <ListItemSecondaryAction>
            <ActionButton
              icon={isRTL ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
              type={ACTION_BUTTON_TYPES.icon}
              rest={{
                className: css.subformShow,
                onClick: handleOpenMatch
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </ConditionalWrapper>
    </List>
  );
}

Component.displayName = "FamilyRecordHeader";

Component.propTypes = {
  handleOpenMatch: PropTypes.func,
  record: PropTypes.object
};

export default Component;
