// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { List, ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

import { ConditionalWrapper, useThemeHelper } from "../../../libs";
import DisableOffline from "../../disable-offline";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../action-button";
import css from "../../record-form/form/subforms/styles.css";
import { useApp } from "../../application";

function Component({ fieldNames, handleOpenMatch, record, linkedRecordType, values }) {
  const { online } = useApp();
  const { isRTL } = useThemeHelper();

  return (
    <List dense classes={{ root: css.list }} disablePadding>
      {values.map(value => (
        <ConditionalWrapper
          condition={!record.get("complete", false) && !online}
          wrapper={DisableOffline}
          offlineTextKey="unavailable_offline"
        >
          <ListItem
            component="a"
            onClick={() => handleOpenMatch(value.get("case_id"))}
            classes={{ root: css.listItem }}
          >
            <ListItemText classes={{ primary: css.listText, secondary: css.listTextSecondary }}>
              <div className={css.listItemText}>
                <span>{value.getIn(["data", "case_id_display"])}</span>
                <span>{value.getIn(["data", "name"])}</span>
                <span>{value.getIn(["data", "module_id"])}</span>
              </div>
            </ListItemText>
            <ListItemSecondaryAction>
              <ActionButton
                icon={isRTL ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                type={ACTION_BUTTON_TYPES.icon}
                rest={{
                  className: css.subformShow,
                  onClick: () => handleOpenMatch(value.get("case_id"))
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </ConditionalWrapper>
      ))}
    </List>
  );
}

Component.displayName = "RecordHeader";

Component.propTypes = {
  fieldNames: PropTypes.array.isRequired,
  handleOpenMatch: PropTypes.func.isRequired,
  linkedRecordType: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired
};

export default Component;
